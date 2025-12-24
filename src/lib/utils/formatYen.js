// @/src/lib/utils/formatYen.js

export function formatYen(value) {
  const yen = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(yen)) return "";
  return yen.toLocaleString("ja-JP");
};

// 数字か否かを判定するメソッド
// Number.isFinite(1000);        // true
// Number.isFinite(0);           // true
// Number.isFinite(-500);        // true

// Number.isFinite(NaN);         // false
// Number.isFinite(Infinity);   // false
// Number.isFinite(-Infinity);  // false
// Number.isFinite("1000");     // false（文字列！）
// Number.isFinite(null);       // false
// Number.isFinite(undefined);  // false