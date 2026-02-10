// @/app/experiences/[slug]/page.jsx

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { getReviewsByExperienceSlug } from "@/lib/server/getReviewsByExperienceSlug";
import { formatDuration } from "@/lib/utils/formatDuration";
import { formatYen } from "@/lib/utils/formatYen";
import { buildScheduleText } from "@/lib/utils/buildSchedule";
import RatingStars from "@/components/reviews/RatingStars"; 
import { calcReviewSummary } from "@/lib/reviews/reviewSummary"; 
import styles from "./page.module.scss";

export default async function ExperienceDetailPage({ params }) {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) return notFound();

  const reviews = await getReviewsByExperienceSlug(exp.slug);
  const { count, avg } = calcReviewSummary(reviews)

  return (
    <div className={`container ${styles.experienceDetail}`}>
      {/* Hero */}
      <section className={`hero ${styles.heroDetail}`}>
        <div className={`hero__inner ${styles.heroInner}`}>
          <p className="hero__eyebrow">Experience</p>

          <h1 className={`hero__title ${styles.heroTitle}`}>{exp.title}</h1>
          {/* 短いリードがある場合だけ */}
          {exp.summary && (
            <p className={`hero__lead ${styles.heroLead}`}>{exp.summary}</p>
          )}

          <div className={`image-wrapper ${styles.heroImage}`}>
            <Image
              src={exp.heroImage?.src || "/experiences/sokan-tea.jpg"}
              alt={exp.heroImage?.alt || exp.title}
              fill
              sizes="100vw"
              priority
            />
          </div>

          {/* Spec */}
          <dl className={`spec-wrapper ${styles.specWrapper}`}>
            <div className="spec">
              <dt>Schedule</dt>
              <dd>{buildScheduleText(exp)}</dd>
            </div>

            <div className="spec">
              <dt>Duration</dt>
              <dd>{formatDuration(exp.durationMinutes)}</dd>
            </div>

            <div className="spec">
              <dt>Price</dt>
              <dd>￥{formatYen(exp.priceJPY)} / person</dd>
            </div>

            <div className="spec">
              <dt>Capacity</dt>
              <dd>Up to {exp.capacity} guests</dd>
            </div>
          </dl>

          {/* CTA */}
          <div className={`next-action ${styles.nextAction}`}>
            <Link
              className="btn btn--primary"
              href={`/booking?experience=${exp.slug}`}
            >
              Check availability
            </Link>

            <Link className="btn btn--ghost" href="/experiences">
              Back to experiences
            </Link>
          </div>

          {/* 重要事項を短く再掲 */}
          {exp.notice && <p className="hero__fineprint">{exp.notice}</p>}
        </div>
      </section>

      {/* Highlights */}
      {Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
        <section className="sec">
          <h2 className="sec__title">Highlights</h2>
          <ul className="bullets">
            {exp.highlights.map((highlight, idx) => (
              <li key={idx}>{highlight}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Policy / Details (Sokan Zen Meditation & Tea) */}
      {exp.slug === "sokan-zen-tea" && (
        <section>
          <h2 className="sec__title">Zen & Tea — What to Expect</h2>

          <h3 className="sec__sub-title">
            A quiet experience at a secluded temple
          </h3>
          <p>
            This experience takes place in the Yase area, at the foot of Mount
            Hiei in northern Kyoto. The venue is a living temple — not a tourist
            facility — and the atmosphere is calm and respectful.
          </p>

          <h3 className="sec__sub-title">Tea, prepared in silence</h3>
          <p>
            Tea is prepared and served quietly, shaped by the monk’s own
            practice and experience. This is not a staged performance — it is a
            simple, sincere session designed to preserve stillness.
          </p>

          <h3 className="sec__sub-title">Seating</h3>
          <p>
            Seating is floor-based, as is traditional in Zen practice. This
            experience may not be suitable for guests who require chairs.
          </p>

          <h3 className="sec__sub-title">Photography policy</h3>
          <p>Photography and personal video recording are not permitted.</p>
          <p>
            This temple values privacy and quiet continuity over public
            exposure. To protect the community that supports this place, guests
            are asked not to take images that could identify the location.
          </p>
          <p>
            A photographer will document the experience on behalf of all
            participants. Photos will be shared privately by email after the
            session.
          </p>

          <h3 className="sec__sub-title">Cancellation</h3>
          <p>Free cancellation up to 24 hours before the experience.</p>

          <h3 className="sec__sub-title">Same-day contact</h3>
          <p>
            For same-day contact, please use email. Details will be provided
            after booking.
          </p>

          <div className="next-action">
            <Link
              className="btn btn--primary"
              href={`/booking?experience=${exp.slug}`}
            >
              Check availability
            </Link>
          </div>
        </section>
      )}

      <hr className="divider" />

      {/* Reviews */}
      <section>
        <h2 className="section__title">Reviews</h2>
        {count === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <>
            <div className="reviewSummary">
              <div className="reviewSummary__avg">
                {avg.toFixed(1)}&nbsp;/&nbsp;5
              </div>
              <div className="reviewSummary__stars">
                <RatingStars rating={avg} />
              </div>
              <div className="reviewSummary__count parens">
                <span className="parens__left">(</span>
                  <span className="margin-R-thin">{count}</span>reviews
                <span className="parens__right">)</span>
              </div>
            </div>

            <ul className={styles.review}>
              {reviews.map((review, idx) => (
                <li key={idx}>
                  <div className={styles.review__info}>
                    <div className={styles.review__displayName}>
                      {review.displayName}
                    </div>
                    <div className={`${styles.review__countryRating} parens`}>
                      <span className="parens__left">(</span>
                      {review.country},&nbsp;★{review.rating}
                      <span className="parens__right">)</span>
                    </div>
                  </div>
                  <p className={styles.review__comment}>{review.comment}</p>
                  <div className={styles.review__meta}>
                    {review.date} / {review.source}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
