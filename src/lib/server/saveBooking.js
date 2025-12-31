// @/lib/server/saveBooking.js

import "server-only";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { handleToISODateString } from "@/lib/utils/handleToISODateString";

export async function saveBooking({
  experienceSlug,
  bookingDate,
  guests,
  name,
  email
}) {
  if (!experienceSlug) throw new Error("Missing experienceSlug");
  if (!(bookingDate instanceof Date) || !Number.isFinite(bookingDate.getTime())) {
    throw new Error("Invalid bookingDate");
  }
  if (!Number.isFinite(guests) || guests < 1) throw new Error("Invalid guests");

  const { error } = await supabaseAdmin.from("bookings").insert({
    experience_slug: experienceSlug,
    booking_date: handleToISODateString(bookingDate),
    guests,
    name: name || null,
    email: email || null,
  });

  if (error) throw new Error(`Supabase insert failed: ${error.message}`);
}

// function toISODateString(date) {
//   // date: JavaScript Data
//   // Supabaseのdate型を入れるのでYYYY-MM-DDにする
//   const y = date.getFullYear();
//   const m = String(date.getMonth() + 1).padStart(2, "0");
//   const d = String(date.getDate()).padStart(2, "0");

//   return `${y}-${m}-${d}`;
// }