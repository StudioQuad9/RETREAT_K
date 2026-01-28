// @/app/experiences/[slug]/page.jsx

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { getReviewByExperienceSlug } from "@/lib/data/reviews";
import { formatDuration } from "@/lib/utils/formatDuration";
import { formatYen } from "@/lib/utils/formatYen";
import { buildScheduleText } from "@/lib/utils/buildSchedule";

export default async function ExperienceDetailPage({ params }) {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) return notFound();

  const reviews = getReviewByExperienceSlug(exp.slug);

  return (
    <main className="experienceDetail">
      {/* Hero */}
      <section className="hero hero--detail">
        <div className="hero__inner container">
          <p className="hero__eyebrow">Experience</p>

          <h1 className="hero__title">{exp.title}</h1>


          {/* 短いリードがある場合だけ */}
          {exp.summary && <p className="hero__lead">{exp.summary}</p>}

          <Image 
            src={exp.heroImage?.src || "/experiences/sokan-tea.jpg"}
            alt={exp.heroImage?.alt || exp.title}
            width={1600}
            height={600}
            priority
          />

          {/* Spec */}
          <dl className="specs">
            <div className="specs__item">
              <dt className="specs__label">Schedule</dt>
              <dd className="specs__value">{buildScheduleText(exp)}</dd>
            </div>

            <div className="specs__item">
              <dt className="specs__label">Duration</dt>
              <dd className="specs__value">
                {formatDuration(exp.durationMinutes)}
              </dd>
            </div>

            <div className="specs__item">
              <dt className="specs__label">Price</dt>
              <dd className="specs__value">
                ￥{formatYen(exp.priceJPY)} / person
              </dd>
            </div>

            <div className="specs__item">
              <dt className="specs__label">Capacity</dt>
              <dd className="specs__value">Up to {exp.capacity} guests</dd>
            </div>
          </dl>

          {/* CTA */}
          <div className="next-actions">
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
        <section className="section">
          <div className="container">
            <h2 className="section__title">Highlights</h2>
            <ul className="bullets">
              {exp.highlights.map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Policy / Details (Sokan Zen Meditation & Tea) */}
      {exp.slug === "sokan-zen-tea" && (
        <section className="section">
          <div className="container">
            <h2 className="section__title">Zen & Tea — What to Expect</h2>

            <h3>A quiet experience at a secluded temple</h3>
            <p>
              This experience takes place in the Yase area, at the foot of Mount
              Hiei in northern Kyoto. The venue is a living temple — not a
              tourist facility — and the atmosphere is calm and respectful.
            </p>

            <h3>Tea, prepared in silence</h3>
            <p>
              Tea is prepared and served quietly, shaped by the monk’s own
              practice and experience. This is not a staged performance — it is
              a simple, sincere session designed to preserve stillness.
            </p>

            <h3>Seating</h3>
            <p>
              Seating is floor-based, as is traditional in Zen practice. This
              experience may not be suitable for guests who require chairs.
            </p>

            <h3>Photography policy</h3>
            <p>Photography and personal video recording are not permitted.</p>
            <p>
              This temple values privacy and quiet continuity over public
              exposure. To protect the community that supports this place,
              guests are asked not to take images that could identify the
              location.
            </p>
            <p>
              A photographer will document the experience on behalf of all
              participants. Photos will be shared privately by email after the
              session.
            </p>

            <h3>Cancellation</h3>
            <p>Free cancellation up to 24 hours before the experience.</p>

            <h3>Same-day contact</h3>
            <p>
              For same-day contact, please use email. Details will be provided
              after booking.
            </p>

            <div className="section__actions">
              <Link
                className="btn btn--primary"
                href={`/booking?experience=${exp.slug}`}
              >
                Check availability
              </Link>
            </div>
          </div>
        </section>
      )}

      <hr className="divider" />

      {/* Reviews */}
      <section className="section">
        <div className="container">
          <h2 className="section__title">Reviews</h2>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <ul className="reviews">
              {reviews.map((review, idx) => (
                <li key={idx} className="review">
                  <strong>{review.displayName}</strong>({review.country} *
                  {review.rating}
                  )
                  <br />
                  {review.comment}
                  <br />
                  <small>
                    {review.date} / {review.source}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
