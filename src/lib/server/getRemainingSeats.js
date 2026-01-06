// @/lib/server/getRemainingSeats.js

import "server-only";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export async function getRemainingSeats({ experienceSlug, bookingDateISO, capacity }) {
  // 体験の有無
  if (!experienceSlug) throw new Error("Missing experienceSlug");
  // 予約日の有無
  if (typeof bookingDateISO !== "string") throw new Error("Missing bookingDateISO");
  // 催行人数が数字か？　0名より少ないか？
  if (!Number.isFinite(capacity) || Number(capacity) < 0) throw new Error("Invalid capacity");

  // まずはRPCを試す
  try {
    // rpcメソッドは、Supabase上で設定したbooked_guests関数を使い、
    // 体験と日時に紐づいた予約人数の合計を整数で返す。
    // 期待する値は、日付に紐づいた、{ bookedCount, remainingCount }。
    const { data, error } = await supabaseAdmin.rpc("booked_guests", {
      p_experience_slug: experienceSlug,
      p_booking_date: bookingDateISO, //  “YYYY-MM-DD”（date型）で渡すのがポイント
    });
    if (error) throw error;

    const bookedCount = Number(data ?? 0);
    // 計算に際して、結果がマイナスだったら0を返し、
    // 整数なら計算結果を返す。計算結果で大きい方（max）を返す。
    const remainingCount = Math.max(0, Number(capacity) - bookedCount);

    return { bookedCount, remainingCount };
  } catch (e) {
    // フォールバック: bookingsを直接読んでローカル上でJS使って合計する。
    // つまり、処理が重い。
    // だから、tryが通らなかった際の保険として使う。
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("guests")
      .eq("experience_slug", experienceSlug)
      .eq("booking_date", bookingDateISO);
    
    if (error) {
      throw new Error(`getRemainingSeats falied: ${error.message}`);
    }

    const bookedCount = (data ?? []).reduce((sum, row) => {
      return sum + Number(row.guests || 0);
    }, 0);
    const remainingCount = Math.max(0, Number(capacity) - bookedCount);
    
    return { bookedCount, remainingCount };
  }
}