import Link from "next/link";
import { getExperienceBySlug } from "@/lib/data/experiences";

const WEEKDAY_LABEL = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUN: "Sun",
};

export default async function BookingCompletePage({ searchParams }) {
  // Next.js 15系では searchParams が Promise になることがあるので await します
  const params = await searchParams;

  const experienceSlug = params?.experience || "";
  const guestName = params?.name || "";
  const guestCount = params?.guests || "";
  const email = params?.email || "";

  const exp = experienceSlug ? getExperienceBySlug(experienceSlug) : null;

  const scheduleText = exp?.scheduleDetails
    ? exp.scheduleDetails
        .map(
          (schedule) =>
            `${WEEKDAY_LABEL[schedule.weekday]} ${schedule.time}`
        )
        .join(", ")
    : "";

  return (
    <main>
      <h1 className="en">Booking Confirmed</h1>

      <p>Thank you. Your booking is confirmed.</p>

      {exp ? (
        <section>
          <h2>Summary</h2>
          <p>Experience: {exp.title}</p>
          <p>Schedule: {scheduleText}</p>
          {guestCount ? <p>Guests: {guestCount}</p> : null}
          {email ? <p>Email: {email}</p> : null}
        </section>
      ) : (
        <section>
          <h2>Summary</h2>
          <p>
            We couldn&apos;t read the experience info. Please return to the experiences page.
          </p>
        </section>
      )}

      <section>
        <h2>Next steps</h2>
        <p>
          We will send you a confirmation email with meeting details.
        </p>
      </section>

      <section>
        <h2>After the experience</h2>
        <p>
          After your experience, we will send you a short review request. Your
          feedback helps us preserve authentic cultural programs.
        </p>
      </section>

      <div className="enter-btn">
        <Link href="/experiences">Back to Experiences</Link>
      </div>

      {exp ? (
        <div className="enter-btn">
          <Link href={`/experiences/${exp.slug}`}>Back to details</Link>
        </div>
      ) : null}
    </main>
  );
}
