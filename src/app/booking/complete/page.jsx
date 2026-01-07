// @/app/booking/complete/page.jsx

import Link from "next/link";
import { stripe } from "@/lib/server/stripe";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { formatDuration } from "@/lib/utils/formatDuration";
import { formatYen } from "@/lib/utils/formatYen";
import { formatBookingDateText } from "@/lib/utils/formatBookingDateText";

export default async function BookingCompletePage({ searchParams }) {
  // Next.js 15系では searchParams が Promise になることがあるので await します
  const params = await searchParams;
  const sessionID = params?.session_id || "";
  if (!sessionID) {
    return (
      <main>
        <h1 className="em">Payment complete</h1>
        <p>We couldn&apos;t read the payment session.</p>
        <div className="enter-btn">
          <Link href="/experiences">Go to Experiences</Link>
        </div>
      </main>
    )
  }

  const session = await stripe.checkout.sessions.retrieve
  (sessionID);
  const md = session?.metadata || {};

  const experienceSlug = md.experienceSlug || "";
  const name = md.name || "";
  const email = md.email || "";
  const guestCount = md.guests || "";
  const dateRaw = md.bookingDateISO || "";

  const exp = experienceSlug ? getExperienceBySlug(experienceSlug) : null;
  const bookingDateText = formatBookingDateText(dateRaw);
  const isPaid = session?.payment_status === "paid";

  return (
    <main>
      <h1 className="en">{isPaid 
                            ? "Booking complete (Paid)"
                            : "Payment status pending"
                          }
      </h1>
      {isPaid
        ? (<p>Your payment is confirmed. We will email your booking details.</p>)
        : (<p>
              We recive your session, but payment is not confirmed yet.<br />
              If you beleve this is a mistake, please contact us.
          </p>)
      }

      {exp ? (
        <section>
          <h2>Summary</h2>
          <div className="spec">Experience: {exp.title}</div>
          {bookingDateText && (
            <div className="spec">Booking date: {bookingDateText}</div>
          )}
          <div className="spec">Minimum to run: {exp.minGuests} guests</div>
          <div className="spec">Capacity: {exp.capacity} guests</div>
          <div className="spec">
            Duration: {formatDuration(exp.durationMinutes)}
          </div>
          <div className="spec">
            Price: ￥{formatYen(exp.priceJPY * guestCount)} / total<br />
            (￥{formatYen(exp.priceJPY)} / person)
          </div>
          {name ? <div className="spec">Name: {name}</div> : null}
          {guestCount ? <div className="spec">Guests: {guestCount}</div> : null}
          {email ? <div className="spec">Email: {email}</div> : null}
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