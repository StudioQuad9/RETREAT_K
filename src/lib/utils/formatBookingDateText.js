// @/lib/utils/formatBookingDateText.js

// isoDate: "YYYY-MM-DD"のような文字列を引数となることが前提
export function formatBookingDateText(isoDate, locale = "en-US") {
  if (typeof isoDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return "";
  }
  // UTCの 00:00 として解釈 → どの環境でも同じ日付になりやすい
  // jsのDateオブジェクトへ復号する。
  const day = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(day.getTime())) return "";

  return day.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    // 表示タイムゾーンも固定したいなら入れる
    // （日本基準なら特におすすめ）
    timeZone: "Asia/Tokyo",
  });
}