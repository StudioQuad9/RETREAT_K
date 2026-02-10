// @/lib/reviews/reviewSummary.js

export function calcReviewSummary(reviews = []) {
  const list = Array.isArray(reviews) ? reviews : [];
  const count = list.length;
  if (count === 0) return { count: 0, avg: 0 };
  // experience_slugに格納されているプロパティrating
  // この値を参照する方法は、インスタンス.ratingだったよね。
  const sum = list.reduce((acc, ratingVal) => acc + (Number(ratingVal.rating) || 0), 0);
  const avg = sum / count;
  return { count, avg };
}