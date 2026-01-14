// @/lib/server/saveBooking.js

import "server-only";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { toISODateString } from "@/lib/utils/toISODateString";

// Stripe webhook の二重実行を防ぐため、stripeSessionId を必須にする。
// UNIQUE 制約違反(23505)は「想定内」なので throw せず inserted:false を返す。
export async function saveBooking({
  stripeSessionId,
  experienceSlug,
  bookingDate,
  guests,
  name,
  email,
}) {
  if (!stripeSessionId) throw new Error("Missing stripeSessionId");
  if (!experienceSlug) throw new Error("Missing experienceSlug");
  if (!(bookingDate instanceof Date) || Number.isNaN(bookingDate.getTime())) {
    throw new Error("Invalid bookingDate");
  }
  if (!Number.isFinite(guests) || guests < 1) throw new Error("Invalid guests");

  const emailNorm = String(email || "")
    .trim()
    .toLowerCase();

  const payload = {
    stripe_session_id: stripeSessionId,
    experience_slug: experienceSlug,
    booking_date: toISODateString(bookingDate),
    guests,
    name: name || null,
    email: emailNorm || null,
  };

  const { error } = await supabaseAdmin.from("bookings").insert(payload);

  if (!error) return { inserted: true };

  // ✅ Postgres unique violation
  if (error.code === "23505") {
    // どの制約で落ちたかは message/details に入ることが多い
    const msg = String(error.message || "");
    const details = String(error.details || "");

    if (msg.includes("bookings_stripe_session_id_unique") || details.includes("bookings_stripe_session_id_unique")) {
      return { inserted: false, reason: "duplicate_stripe_session_id" };
    }
    if (msg.includes("bookings_unique") || details.includes("bookings_unique")) {
      return { inserted: false, reason: "duplicate_booking_unique" };
    }
    return { inserted: false, reason: "duplicate_unknown_unique" };
  }

  throw new Error(`Supabase insert failed: ${error.message}`);
}




// // @/lib/server/saveBooking.js

// import "server-only";
// import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
// import { toISODateString } from "@/lib/utils/toISODateString";

// // Stripe webhook の「二重実行」を防ぐため、
// // stripeSessionId をキーにして「既に保存済みなら何もしない」。
// export async function saveBooking({
//   stripeSessionId,
//   experienceSlug,
//   bookingDate,
//   guests,
//   name,
//   email,
// }) {
//   if (!stripeSessionId) throw new Error("Missing stripeSessionId");
//   if (!experienceSlug) throw new Error("Missing experienceSlug");
//   if (
//     !(bookingDate instanceof Date) ||
//     !Number.isFinite(bookingDate.getTime())
//   ) {
//     throw new Error("Invalid bookingDate");
//   }
//   if (!Number.isFinite(guests) || guests < 1) throw new Error("Invalid guests");

//   // 1) すでにこの Stripe セッションで保存済みなら終了（メールも送らないための判定材料）
//   const { data: existing, error: selErr } = await supabaseAdmin
//     .from("bookings")
//     .select("id")
//     .eq("stripe_session_id", stripeSessionId)
//     .maybeSingle();

//   if (selErr) throw new Error(`Supabase select failed: ${selErr.message}`);
//   if (existing?.id) {
//     return { inserted: false, reason: "already_saved" };
//   }

//   // 2) 未保存なら insert
//   const { error: insErr } = await supabaseAdmin.from("bookings").insert({
//     stripe_session_id: stripeSessionId,
//     experience_slug: experienceSlug,
//     booking_date: toISODateString(bookingDate),
//     guests,
//     name: name || null,
//     email: email || null,
//   });

//   if (insErr) {
//     // ここで bookings_unique(experience_slug, booking_date, email) に当たる可能性もある
//     throw new Error(`Supabase insert failed: ${insErr.message}`);
//   } 

//   return { inserted: true };
// }