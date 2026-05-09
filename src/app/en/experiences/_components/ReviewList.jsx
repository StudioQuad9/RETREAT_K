// @/app/en/experiences/_components/ReviewList.jsx

import styles from "../experiences.module.scss";

export default function ReviewList({ reviews = [] }) {
  const publishedReviews = reviews.filter((review) => {
    return review.isPublished;
  });

  if (publishedReviews.length === 0) {
    return null;
  }

  return (
    <section className={styles.reviews}>
      <h2>Guest Reviews</h2>

      <div className={styles.reviewList}>
        {publishedReviews.map((review, index) => (
          <article className={styles.reviewCard} key={index}>
            <div className={styles.reviewRating}>
              {"★".repeat(review.rating)}
            </div>

            <p className={styles.reviewText}>"{review.text}"</p>

            <div className={styles.reviewMeta}>
              {review.firstaName}, {review.country} / {review.date}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
