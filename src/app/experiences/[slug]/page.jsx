// @/app/experiences/[slug]/page.jsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { getReviewByExperienceSlug } from "@/lib/data/reviews";
import { formatDuration } from "@/lib/utils/formatDuration";
import { formatYen } from "@/lib/utils/formatYen";
import { buildScheduleText } from "@/lib/utils/buildScheduleText";

export default async function ExperienceDetailPage({ params }) {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) return notFound();

  const reviews = getReviewByExperienceSlug(exp.slug);

  return (
    <main>
      <h1>{exp.title}</h1>
      <div className="spec">
        Duration: {formatDuration(exp.durationMinutes)}
      </div>
      <div className="spec">Price: ￥{formatYen(exp.priceJPY)} / person</div>

      <h2>Schedule</h2>
      <ul>
        <li>{buildScheduleText(exp)}</li>
      </ul>

      <h2>Highlights</h2>
      <ul>
        {exp.highlights.map((highlight, idx) => (
          <li key={idx}>{highlight}</li>
        ))}
      </ul>

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
