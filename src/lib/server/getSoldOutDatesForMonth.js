// @/lib/server/getSoldOutDatesForMonth.js

// 表示されている月の中から、完売になった日付を返す。

import "server-only";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin"; // Supabaseに入る許可証
import { formatPad } from "@/lib/utils/formatPad";

// 選んだ月と次の月をYYYY-MM-DD形式で格納する。
function monthRangeISO(year, month1to12) {
  const start = `${year}-${formatPad(month1to12, 2)}-01`;
  const nextMonth = month1to12 === 12 ? 1 : month1to12 + 1;
  const nextYear = month1to12 === 12 ? year + 1 : year;
  const end = `${nextYear}-${formatPad(nextMonth, 2)}-01`;
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
  const cap = Number(capacity);

  if (!experienceSlug) throw new Error("Missing experienceSlug");
  if (!Number.isInteger(year) || year < 2000) throw new Error("Invalid year");
  if (!Number.isInteger(month1to12) || month1to12 < 1 || month1to12 > 12) {
    throw new Error("Invalid month");
  }
  if (!Number.isFinite(cap) || cap < 1) throw new Error("Invalid capacity");

  const { start, end } = monthRangeISO(year, month1to12);

  // 指定月の予約データをまとめて取り出す（1回のクエリ）
  // .gte() => この日付以上に大きい日付　例）2026-01-01
  // .lt() => この日付より小さい日付　例）2026-02-01
  // これで2026年1月の日付の範囲を指定できる。カレンダー設計の肝。
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("booking_date, guests") // 日付に紐づいた予約数
    .eq("experience_slug", experienceSlug)
    .gte("booking_date", start)
    .lt("booking_date", end);

  if (error) {
    throw new Error(`getSoldOutDatesForMonth failed: ${error.message}`);
  }

  // 抜き出した data を使って、日付ごとに guests を合計
  // Mapのset()メソッドを使って、日付に紐づいた予約数を集計する。
  // Mapの生成
  const bookedByDate = new Map(); // key: YYYY-MM-DD, value: sum guests
  // DBから抜き出した data を for で回して、set()メソッドで集計していく。
  for (const row of data ?? []) {
    const date = row.booking_date; // Supabase date型 → "YYYY-MM-DD" が基本
    const guest = Number(row.guests ?? 0);
    if (typeof date !== "string") continue;
    // 同じ日付だったらここで加算される仕組み。たった1行でやってる。凄い。
    bookedByDate.set(date, (bookedByDate.get(date) ?? 0) + guest);
  }

  const soldOutDates = [];

  // 例えば、こういう data が書き出されたとして、
  // Map {
  //   "2026-01-10" => 3,
  //   "2026-01-12" => 5,
  //   "2026-01-15" => 8
  // }  

  // entries() メソッドを充てることでイテレータに変換し、
  // [
  //   ["2026-01-10", 3],
  //   ["2026-01-12", 5],
  //   ["2026-01-15", 8],
  // ];  

  // あとは、分割代入しながらforで回っていくという仕組み。
  for (const [date, sumGuests] of bookedByDate.entries()) {
    if (Number(sumGuests) >= cap) soldOutDates.push(date);
  }

  // 念のため昇順にしておく（UIで扱いやすい）
  soldOutDates.sort();

  return { soldOutDates };
}