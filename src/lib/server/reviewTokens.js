// @/lib/server/reviewTokens.js

import "server-only";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

// 手動メール送信前に「token を作ってURLを作る」ための関数。
// bookingId は public.bookings.id（uuid）
export async function createReviewToken({ bookingId, daysValid = 30 }) {
  if (!bookingId) throw new Error("Missing bookingId");

  // 1) bookingからexperience_slugを取得する。
  const { data: booking, error: bookingErr } = await supabaseAdmin
    .from("bookings")
    .select("id")
    .eq("id", bookingId)
    .maybeSingle();

  if (bookingErr) throw new Error(`Booking lookup failed: ${bookingErr.message}`);
  if (!booking) throw new Error("Booking not found");
  
  const { data: existing, error: existErr } = await supabaseAdmin
    .from("review_tokens")
    .select("token, expires_at, used_at")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (existErr) throw new Error(`Token lookup failed: ${existErr.message}`);

  const now = Date.now();
  const existingExpires = existing?.expires_at
    ? new Date(existing.expires_at).getTime()
    : 0;

  // 未使用 かつ 期限内なら「再発行しない」
  if (existing && !existing.used_at && existingExpires > now) {
    return { token: existing.token, expiresAt: existing.expires_at };
  }

  // 48 chars, crypto: 暗号　つまりtokenにはランダムな16進数文字列を入れてIDにするということ。
  const token = crypto.randomUUID(); 
  // expires: 有効期限。何日で切れます、という意味をわからせる変数名。
  // daysValid: 日数。何日後にtakenを失効するか任意で決める。変数名。
  const expiresAt = new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000).toISOString(); 

  // 既にbookingIdのtoken行はあるか。
  const { error: upsertErr } = await supabaseAdmin
    .from("review_tokens")
    .upsert(
      {
        booking_id: bookingId,
        token,
        expires_at: expiresAt,
        used_at: null  // 再発行は未使用に戻す。
      }, {
        onConflict: "booking_id"
      }
    );
  
  if (upsertErr) throw new Error(`Failed to create/re-issue token: ${upsertErr.message}`);

  // tokenと有効期限を返す。
  return { token, expiresAt };
}

export async function verifyReviewToken(token) {  // verify: 確認する
  if (!token) return { ok: false, error: "Missing token" };

  // token row
  const { data: tokenRow, error: tokenErr } = await supabaseAdmin
    .from("review_tokens")
    .select("token, booking_id, expires_at, used_at")
    .eq("token", token)
    // nullまたは格納されているデータを返す。
    .maybeSingle();

  if (tokenErr) return { ok: false, error: `Token lookup failed: ${tokenErr.message}` };
  if (!tokenRow) return { ok: false, error: "Invalid token" };
  // すでにレビューは書かれてのかを確認する。
  if (tokenRow.used_at) return { ok: false, error: "This link has already been used."};
  // レビューを書くにはもう有効期限を過ぎています。
  if (!tokenRow.expires_at) return { ok: false, error: "This link has expired."};
  // レビューを書く期限が過ぎているかを確認する。
  const now = Date.now();
  const expiresAtMS = new Date(tokenRow.expires_at).getTime();
  if (!Number.isFinite(expiresAtMS) || expiresAtMS < now) return { ok: false, error: "This link has expired."};

  // booking row
  const { data: bookingRow, error: bookingErr } = await supabaseAdmin
    .from("bookings")
    .select("id, experience_slug, booking_date, guests, name, email, created_at")
    .eq("id", tokenRow.booking_id)
    .maybeSingle();

  if (bookingErr) return { ok: false, error: `Booking lookup failed: ${bookingErr.message}`};
  if (!bookingRow) return { ok: false, error: "Booking not found for this token"};

  return { ok: true, tokenRow: tokenRow, booking: bookingRow };
}

// Server Action から呼ぶ：token を根拠にレビューを書き込む
export async function submitReviewWithToken({ token, rating, comment, displayName, country }) {
  const verifiedToken = await verifyReviewToken(token);
  if (!verifiedToken.ok) return { ok: false, error: verifiedToken.error };

  const ratingNum = Number(rating);
  if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5)
    return { ok: false, error: "Invalid rating" };

  const commentStr = String(comment || "").trim();
  if (commentStr.length < 10)
    return { ok: false, error: "Please write at least 10 characters." };

  // 1) insert review（booking_id unique なので二重投稿はここでも止まる）
  // insertErr, updateErrとも{ error }と分割代入してからの別名。
  const { error: insertErr } = await supabaseAdmin.from("reviews").insert({
    booking_id: verifiedToken.booking.id,
    experience_slug: verifiedToken.booking.experience_slug,
    rating: ratingNum,
    comment: commentStr,
    display_name: String(displayName || "").trim() || null,
    country: String(country || "").trim() || null,
    source: "site",
  });

  // unique violation など
  if (insertErr) {
    return { ok: false, error: `Failed to save review: ${insertErr.message}` };
  }
  // 2) used_atには初期値でnullが入っている。投稿されたらここをアップデートする。
  const nowIso = new Date().toISOString();

  const { data: updated, error: updateErr } = await supabaseAdmin
    .from("review_tokens")
    .update({ used_at: nowIso })
    .eq("token", token)
    .is("used_at", null)
    .select("token, used_at");

  // ここは「レビューは保存されたが token の used_at が付かなかった」ケース。
  // 運用上は修正可能なので、致命的扱いにはしない。
  if (updateErr) {
    return {
      ok: true,
      warning: `Save review, but failed to mark token used: ${updateErr.message}`,
    };
  }

  if (!updated || updated.length === 0) {
    return {
      ok: true,
      warning: "Save review, but token row was not updated (token mismatch / aleady used / RLS?)",
    };
  }

  return { ok: true };
}