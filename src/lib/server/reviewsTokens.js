// @/lib/server/reviewsTokens.js

import "server-only";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

// 手動メール送信前に「token を作ってURLを作る」ための関数。
// bookingId は public.bookings.id（uuid）

export async function createReviewToken({ bookingId, daysValid = 30 }) {
  const token = crypto.randomBytes(24).toString("hex"); // 48 chars, crypto: 暗号
  const expiresAt = new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000).toISOString(); // expires: 有効期限が切れますという意味。

  const { error } = await supabaseAdmin.from("review_tokens").insert({
    token,
    booking_id: bookingId,
    expires_at: expiresAt,
  });

  if (error) throw new Error(`Failed to create token: ${error.message}`);
  return { token, expiresAt };
}

export async function verifyReviewToken(token) {  // verify: 確認する
  if (!token) return { ok: false, error: "Missing token" };

  // token row
  const { data: tokenRow, error: tokenErr } = await supabaseAdmin
    .from("review_tokens")
    .select("token, booking_id, expires_at, used_at")
    .eq("token", token)
    .maybeSingle();

  if (tokenErr) return { ok: false, error: `Token loogup failed: ${tokenErr.message}` };
  if (!tokenRow) return { ok: false, error: "This link has already been used."};

  const now = Date.now();
  const exp = new Date(tokenRow.expires_at).getTime();
  if (!Number.isFinite(exp) || exp < now) return { ok: false, error: "This link has expired."};

  // booking row
  const { data: bookingRow, error: bookingErr } = await supabaseAdmin
    .from("bookings")
    .select("id, experience_slug, booking_date, guests, name, email, created_at")
    .eq("id", tokenRow.booking_id)
    .maybeSingle();

  if (bookingErr) return { ok: error, error: `Booking lookup failed: ${bookingErr.message}`};
  if (!bookingRow) return { ok: false, error: "Booking not found for this token"};

  return { ok: true, tokenRow: tokenRow, bookng: bookingRow };
}

// Server Action から呼ぶ：token を根拠にレビューを書き込む
export async function submitReviewWithToken({ token, rating, comment, displayName, country }) {
  const verifyRow = await verifyReviewToken(token);
  if (!verifyRow.ok) return { ok: false, error: verifyRow.error };

  const ratingRow = Number(rating);
  if (!Number.isFinite(ratingRow) || ratingRow < 1 || ratingRow > 5) return { ok: false, error: "Invalid rating"};

  const commentRow = String(comment || "").trim();
  if (commentRow.length < 10) return { ok: false, error: "Please wraite at least 10 characters."};

  // 1) insert review（booking_id unique なので二重投稿はここでも止まる）
  const { error: insErr } = await supabaseAdmin.from("reviews").insert({
    booking_id: verifyRow.booking_id,
    experience_slug: verifyRow.experience_slug,
    rating: ratingRow,
    comment: commentRow,
    display_name: String(displayName || "").trim() || null,
    country: String(country || "").trim() || null,
    source: "site",
  });

  // unique violation など
  if (insErr) {
    return { ok: false, error: `Failed to save review: ${insErr.message}`};
  }
  // 2) mark token used
  const { error: upErr } = await supabaseAdmin
    .from("review_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token", token);
  
  // ここは「レビューは保存されたが token の used_at が付かなかった」ケース。
  // 運用上は修正可能なので、致命的扱いにはしない。
  if (upErr) {
    return { ok: true, warning: `Save review, but faild to mark token used: ${upErr.message}`};
  }

  return { ok: true };
}