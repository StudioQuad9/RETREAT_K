// @/src/lib/utils/formatPad.js

// 合わせたい数字（val）と0で埋めたい数（pad）を引数としてとる。
export function formatPad(val, pad = 2) {
  const num = Number(val);
  const width = Number(pad);

  if (!Number.isInteger(num)) return "";
  if (!Number.isInteger(width) || width < 1) return "";

  return String(num).padStart(width, "0");
}