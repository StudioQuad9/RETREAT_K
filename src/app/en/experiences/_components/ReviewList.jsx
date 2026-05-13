// @/app/en/experiences/_components/ReviewList.jsx

import styles from "./ReviewList.module.scss";

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
              <span>{review.rating}</span>
            </div>

            <div className={styles.reviewMeta}>
              <div className={`${styles.icon} ${styles[`color${index % 5}`]}`}>
                {review.firstName?.trim().charAt(0).toUpperCase()}
              </div>
              <div className={styles.meta}>
                {review.firstName}&nbsp;-&nbsp;{review.country}<br />
                {review.date}
              </div>
            </div>

            <p className={styles.reviewText}>"{review.text}"</p>
          </article>
        ))}
      </div>
    </section>
  );
}
