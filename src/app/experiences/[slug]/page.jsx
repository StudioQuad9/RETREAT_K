// @/app/experiences/[slug]/page.jsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { getReviewByExperienceSlug } from "@/lib/data/reviews";
import { formatDuration } from "@/lib/utils/formatDuration";
import { formatYen } from "@/lib/utils/formatYen";
import { buildScheduleText } from "@/lib/utils/buildSchedule";
import styles from "./page.module.scss";

export default async function ExperienceDetailPage({ params }) {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) return notFound();

  const reviews = getReviewByExperienceSlug(exp.slug);

  return (
    <main className={styles.page}>
      <h1>{exp.title}</h1>
      <div className="spec">
        Duration: {formatDuration(exp.durationMinutes)}
      </div>
      <div className="spec">Price: ￥{formatYen(exp.priceJPY)} / person</div>

      <h2>Schedule</h2>
      <ul>
        <li>{buildScheduleText(exp)}</li>
      </ul>

      <h2>Capacity</h2>
      <div className="spec">up to {exp.capacity} guests</div>

      <h2>Highlights</h2>
      <ul>
        {exp.highlights.map((highlight, idx) => (
          <li key={idx}>{highlight}</li>
        ))}
      </ul>

      {/* Policy / Details (Sokan Zen Meditation & Tea) */}
      { exp.slug === "sokan-zen-tea" && (
        <section>
          <h2>Zen & Tea — What to Expect</h2>

          <h3>A quiet experience at a secluded temple</h3>
          <p>
            This experience takes place in the Yase area, at the foot of Mount
            Hiei in northern Kyoto. The venue is a living temple — not a tourist
            facility — and the atmosphere is calm and respectful.
          </p>

          <h3>Tea, prepared in silence</h3>
          <p>
            Tea is prepared and served quietly, shaped by the monk’s own practice
            and experience. This is not a staged performance — it is a simple,
            sincere session designed to preserve stillness.
          </p>

          <h3>Seating</h3>
          <p>
            Seating is floor-based, as is traditional in Zen practice. This
            experience may not be suitable for guests who require chairs.
          </p>

          <h3>Photography policy</h3>
          <p>Photography and personal video recording are not permitted.</p>
          <p>
            This temple values privacy and quiet continuity over public exposure.
            To protect the community that supports this place, guests are asked
            not to take images that could identify the location.
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
            For same-day contact, please use email. Details will be provided after
            booking.
          </p>
        </section>
      )}

      <div className="enter-btn">
        <Link href={`/booking?experience=${exp.slug}`}>
          Book this experience
        </Link>
      </div>

      <hr />

      <h2>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((review, idx) => (
            <li key={idx}>
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
    </main>
  );
}
