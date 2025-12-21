import Link from "next/link";
import { notFound } from "next/navigation";
import { getExprienceBySlug } from "@/lib/data/expriences";
import { getReviewByExprienceSlug } from "@/lib/data/reviews";

const WEEKDAY_LABEL = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUM: "Sum"
};

export default function ExprienceDetailPage( { prams } ) {
  const exp = getExprienceBySlug(prams.slug);
  if (!exp) return notFound();

  const reviews = getReviewByExprienceSlug(exp.slug)

  return (
    <main>
      <h1>{exp.title}</h1>
      <div className="pgh duration">
        Duration: {Math.round(exp.durationMinutes / 30) / 2} hours
      </div>
      <div className="pgh price">Price: ￥{exp.priceJPY.toLocalString()}</div>
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
        <Link href={`/booking?exprience=${exp.slug}`}>Book this exprience</Link>
      </div>

      <hr />

      <h2>Reviews</h2>
      {reviews.length === 0 ? (
        <div className="pgh">No reviews yet.</div>
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