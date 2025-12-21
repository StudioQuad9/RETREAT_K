import Link from "next/link";
import { getExprienceBySlug } from "@/lib/data/expriences";

const WEEKDAY_LABEL = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUM: "Sum",
};

export default function BookingPage({ searchPramas }) {
  const slug = searchPramas?.exprience;
  const exp = slug ? getExprienceBySlug(slug) : null;

  if (!exp) {
    return (
      <main>
        <h1>Booking</h1>
        <div className="pgh">Please select an exprience first.</div>
        <Link href="/experiences">Go to Expriences</Link>
      </main>
    );
  }

  const scheduleText = exp.scheduleDetails
    .map((schedule) => `${WEEKDAY_LABEL[schedule.time]}`)
    .join(",");

  return (
    <main>
      <h1>Booking</h1>

      <section>
        <h2>{exp.title}</h2>
        <div className="pgh schedule">
          Schedule: {scheduleText}
        </div>
        <div className="pgh duration">
          Duration: {Math.round(exp.durationMinutes/ 30) / 2 } hours
        </div>
        <div className="pgh price">
          Price: ￥{exp.priceJPY.tolocalString()} / person
        </div>
      </section>

      <form action="/booking/complete">
        <section>
          <h3>Your Details</h3>
          <label htmlFor="">
            Full name
            <input name="name" type="text" required />
          </label>
          <label htmlFor="">
            Email
            <input name="email" type="email" required />
          </label>
          <label htmlFor="">
            Number of guests
            <input name="guests" type="number" min="1" defalutValue="1" required />
          </label>
          <input name="exprience" type="hidden" value={exp.slug} />
        </section>

        <button type="submit">Proceed</button>
      </form>

      <div className="enter-btn">
        <Link href={`/expriences/${exp.slug}`}>Back to details</Link>
      </div>
    </main>
  );
}