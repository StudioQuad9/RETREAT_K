// @/app/booking/page.jsx

import Link from "next/link";
import { getExperienceBySlug } from "@/lib/data/experiences";

const WEEKDAY_LABEL = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUM: "Sum",
};

export default async function BookingPage({ searchParams }) {
  const { experience } = await searchParams;
  const exp = experience ? getExperienceBySlug(experience) : null;

  if (!exp) {
    return (
      <main>
        <h1>Booking</h1>
        <p>Please select an experience first.</p>
        <Link href="/experiences">Go to Expriences</Link>
      </main>
    );
  }
// `${WEEKDAY_LABEL[schedule.weekday]} ${schedule.time}`
  const scheduleText = exp.scheduleDetails
    .map((schedule) => {
      const weekdayLabel = WEEKDAY_LABEL[schedule.weekday];
      const timeLabel = schedule.time;
      return `${weekdayLabel} ${timeLabel}`;
    })
    .join(",");

  return (
    <main>
      <h1>Booking</h1>

      <section>
        <h2>{exp.title}</h2>
        <div className="spec">
          Schedule: {scheduleText}
        </div>
        <div className="spec">
          Duration: {Math.round(exp.durationMinutes/ 30) / 2 } hours
        </div>
        <div className="spec">
          Price: ￥{exp.priceJPY.toLocaleString()} / person
        </div>
      </section>

      <form action="/booking/complete">
        <section>
          <h3>Your Details</h3>
          <label htmlFor="name">
            Full name
            <input id="name" name="name" type="text" required />
          </label>
          <label htmlFor="email">
            Email
            <input id="email" name="email" type="email" required />
          </label>
          <label htmlFor="guests">
            Number of guests
            <input id="guests" name="guests" type="number" min="1" defalutValue="1" required />
          </label>
          <input name="experience" type="hidden" value={exp.slug} />
        </section>

        <button type="submit">Proceed</button>
      </form>

      <div className="enter-btn">
        <Link href={`/experiences/${exp.slug}`}>Back to details</Link>
      </div>
    </main>
  );
}