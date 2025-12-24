// @/app/booking/page.jsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { formatDuration } from "@/lib/utils/formatDuration";
import { formatYen } from "@/lib/utils/formatYen";

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
  const params = await searchParams;
  const experienceSlug = params?.experience || "";
  const exp = experienceSlug ? getExperienceBySlug(experienceSlug) : null;

  async function sumbitBooking(formData) {
    "use server";

    const experience = String(formData.get("experience") || "");
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const guests = String(formData.get("guests") || "");

    const query = new URLSearchParams({ experience, name, email, guests });
    redirect(`/booking/complete?${query.toString()}`);
  }

  if (!exp) {
    return (
      <main>
        <h1>Booking</h1>
        <p>Please select an experience first.</p>
        <Link href="/experiences">Go to Expriences</Link>
      </main>
    );
  }

  const scheduleText = exp.scheduleDetails
    .map((schedule) => {
      return `${ WEEKDAY_LABEL[schedule.weekday] ?? schedule.weekday } ${ schedule.time }`;
    })
    .join(", ");

  return (
    <main>
      <h1>Booking</h1>

      <section>
        <h2>{exp.title}</h2>
        <div className="spec">Schedule: {scheduleText}</div>
        <div className="spec">
          Duration: {formatDuration(exp.durationMinutes)}
        </div>
        <div className="spec">
          Price: ￥{formatYen(exp.priceJPY)} / person
        </div>
      </section>

      <form action={sumbitBooking}>
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
            <input
              id="guests"
              name="guests"
              type="number"
              min="1"
              defalutvalue="1"
              required
            />
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