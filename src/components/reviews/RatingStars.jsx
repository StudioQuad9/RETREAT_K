// @/components/reviews/RatingStars.jsx

export default function RatingStars({ rating = 0, outOf = 5, label }) {
  // 0以上、5以下の値が入る。
  const ratingValue = Math.max(0, Math.min(outOf, Number(rating) || 0));
  const fullStars = Math.floor(ratingValue);
  const hasHalfStar = ratingValue - fullStars >= 0.5;
  const emptyStars = outOf - fullStars - (hasHalfStar ? 1 : 0);

  const stars =
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars);

  return (
    <span aria-label={label || `Rating ${ratingValue} out of ${outOf}`}>
      {stars}
    </span>
  );
}
