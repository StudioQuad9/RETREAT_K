// @/lib/server/getRemainingSeats.js

import "server-only";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export async function getRemainingSeats({ experienceSlug, bookingDateISO, capacity }) {
  // 体験の有無
  if (!experienceSlug) throw new Error("Missing experienceSlug");
  // 予約日の有無
  if (!bookingDateISO) throw new Error("Missing bookingDateISO");
  // 催行人数が数字、1名より少ないか
  if (!Number.isFinite(capacity) || capacity < 1) throw new Error("Invalid capacity");

  const { data, error } = await supabaseAdmin.rpc("booked_guests", {
    p_experience_slug: experienceSlug,
    p_booking_date: bookingDateISO, //  “YYYY-MM-DD”（date型）で渡すのがポイント
  });

  if (error) throw new Error(`RPC booked_guests failed: ${error.message}`);

  const booked = Number(data || 0);
  const remaining = capacity - booked;

  return { booked, remaining: Math.max(0, remaining) };
}