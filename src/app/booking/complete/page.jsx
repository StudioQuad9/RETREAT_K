import Link from "next/link";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { formatDuration } from "@/lib/utils/formatDuration";
import { formatYen } from "@/lib/utils/formatYen";
import { buildScheduleText } from "@/lib/utils/buildScheduleText";

export default async function BookingCompletePage({ searchParams }) {
  // Next.js 15系では searchParams が Promise になることがあるので await します
  const params = await searchParams;
  const experienceSlug = params?.experience || "";
  // const guestName = params?.name || "";
  // const guestCount = params?.guests || "";
  // const email = params?.email || "";

  const exp = experienceSlug ? getExperienceBySlug(experienceSlug) : null;

  const scheduleText = buildScheduleText(exp);

  return (
    <main>
      <h1 className="en">Booking complete</h1>
      <p>
        Your booking is confirmed. We will send a confirmation email with
        details.
      </p>

      {exp ? (
        <section>
          <h2>Summary</h2>
          <div className="spec">Experience: {exp.title}</div>
          <div className="spec">Schedule: {scheduleText}</div>
          <div className="spec">Minimum to run: {exp.minGuests} guests</div>
          <div className="spec">Capacity: {exp.capacity} guests</div>
          <div className="spec">
            Duration: {formatDuration(exp.durationMinutes)}
          </div>
          <div className="spec">
            Price: ￥{formatYen(exp.priceJPY)} / person
          </div>
          {/* {guestCount ? <div className="spec">Guests: {guestCount}</div> : null} */}
          {/* {email ? <div className="spec">Email: {email}</div> : null} */}
        </section>
      ) : (
        <section>
          <h2>Summary</h2>
          <p>
            We couldn&apos;t read the experience info. Please return to the
            experiences page.
          </p>
        </section>
      )}
      <section>
        <h2>What’s next</h2>
        <ul>
          <li>We’ll email you meeting details and a simple checklist.</li>
          <li>Please arrive 10 minutes early.</li>
          <li>If you have questions, reply to the confirmation email.</li>
        </ul>
      </section>
      <section>
        <h2>Review (after your experience)</h2>
        <p>
          After your experience, we will send you a short review request. Your
          feedback helps us preserve authentic cultural programs.
        </p>
      </section>
      {exp && (
        <div className="enter-btn">
          <Link href={`/experiences/${exp.slug}`}>Back to experience page</Link>
        </div>
      )}
      <section>
        <p>If you want to book another experience, please check our list.</p>
        <div className="enter-btn">
          <Link href="/experiences">Go to Experiences</Link>
        </div>
      </section>
    </main>
  );
}