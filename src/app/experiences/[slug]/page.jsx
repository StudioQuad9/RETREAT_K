// @/app/experiences/[slug]/page.jsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { getReviewByExperienceSlug } from "@/lib/data/reviews";
import { formatYen } from "@/lib/utils/formatYen";

const WEEKDAY_LABEL = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUN: "Sun",
};

export default async function ExperienceDetailPage({ params }) {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);
  if (!exp) return notFound();

  const reviews = getReviewByExperienceSlug(exp.slug);

  return (
    <main>
      <h1>{exp.title}</h1>
      <div className="spec">
        Duration: {Math.round(exp.durationMinutes / 30) / 2} hours
      </div>
      <div className="spec">
        Price: ￥{formatYen(exp.priceJPY)} / person
      </div>

      <h2>Schedule</h2>
      <ul>
        {exp.scheduleDetails.map((schedule, idx) => (
          <li key={idx}>
            {WEEKDAY_LABEL[schedule.weekday]} {schedule.time}
          </li>
        ))}
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
