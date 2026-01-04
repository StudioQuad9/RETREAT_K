// @/lib/utils/toISODateString.js

// 入力をISOに則った日付文字列に変換する関数定義
export function toISODateString(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();         // 年
  const m = String(date.getMonth() + 1) // 月（1〜12）
            .padStart(2, "0");          // 2桁に揃える
  const d = String(date.getDate())      // 日（1〜28–31）
            .padStart(2, "0");          // 2桁に揃える
          
  return `${y}-${m}-${d}`;              // YYYY-MM-DD                  
}

/*
  ISO = International Organization for Standardization（国際標準化機構）
  ISO 8601 という日付の国際規格がある。

  代表例：
  | 形式 | 意味 |
  | ---- | ---- |
  | 2025-01-03 | 日付のみ（date） |
  | 2025-01-03T10:30:00Z | 日付＋時刻（UTC） |
  | 2025-01-03T19:30:00+09:00 | 日付＋時刻（JST） |
*/