// @/lib/server/getSoldOutDatesForMonth.js

import "server-only";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function monthRangeISO(year, month1to12) {
  const start = `${year}-${pad2(month1to12)}-01`;
  const nextMonth = month1to12 === 12 ? 1 : month1to12 + 1;
  const nextYear = month1to12 === 12 ? year + 1 : year;
  const end = `${nextYear}-${pad2(nextMonth)}-01`;
  return { start, end };
}

/*
  指定月の「満席日(remainingCount===0)」だけを返す
  - experienceSlug: text
  - year: 2026
  - month1to12: 1..12
  - capacity: 定員
  return: { soldOutDates: ["YYYY-MM-DD", ...] }
*/

export async function getSoldOutDatesForMonth({
  experienceSlug,
  year,
  month1to12,
  capacity,
}) {
  if (!experienceSlug) throw new Error("Missing experienceSlug");
  if (!Number.isInteger(year) || year < 2000) throw new Error("Invalid year");
  if (!Number.isInteger(month1to12) || month1to12 < 1 ||month1to12 > 12) {
    throw new Error("Invalid month");
  }
  if (!Number.isFinite(Number(capacity)) || Number(capacity) < 1) {
    throw new Error("Invalid capacity");
  }

  const { start, end } = monthRangeISO(year, month1to12);

  // 指定月の予約データをまとめて取り出す（1回のクエリ）
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("booking_date, guests")
    .eq("experience_slug", experienceSlug)
    .gte("booking_date", start)
    .lt("booking_date", end);
  
  if (error) {
    throw new Error(`getSoldOutDatesForMonth failed: ${error.message}`);
  }

  // 日付ごとに guests を合計
  const bookedByDate = new Map(); // key: YYYY-MM-DD, value: sum guests
  for (const row of data ?? []) {
    const d = row.booking_date; // Supabase date型 → "YYYY-MM-DD" が基本
    const g = Number(row.guests ?? 0);
    if (typeof d !== "string") continue;
    bookedByDate.set(d, (bookedByDate.get(d) ?? 0) + g)
  }

  const cap = Number(capacity);
  const soldOutDates = [];
  for (const [d, sumGuests] of bookedByDate.entries()) {
    if (Number(sumGuests) >= cap) soldOutDates.push(d);
  }
  
  // 念のため昇順にしておく（UIで扱いやすい）
  soldOutDates.sort();

  return { soldOutDates };
}