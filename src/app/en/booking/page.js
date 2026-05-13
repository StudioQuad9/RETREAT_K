// @/app/en/booking/page.js

import { experiences } from "../experiences/_data/experiences";
import { getGuestText, getDurationText } from "@/lib/formatExperiences";
import BookingForm from "./_components/BookingForm";
import styles from "./booking.module.scss";

// export const dynamic = "force-dynamic";

export default async function BookingPage({ searchParams }) {
  const { experience: experienceSlug } = await searchParams;

  const experience = experiences.find((item) => {
    return item.slug === experienceSlug;
  });

  if (!experience) {
    return (
      <div className="container">
        <h1>Request Booking</h1>
        <p>Please select an experience first.</p>
      </div>
    );
  }

  const guestText = getGuestText(experience.pricing);
  const durationText = getDurationText(experience.duration);

  return (
    <div className="container">
      <div className={styles.bookingPage}>
        <section className={styles.bookingHero}>
          <p className={styles.kicker}>Awai Studio</p>
          <h1>Request Booking</h1>
          <p>
            Please send us your preferred date and details. Availability will be
            confirmed munually before payment.
          </p>
        </section>

        <section className={styles.experienceSummary}>
          <h2>{experience.title}</h2>
          <p>{experience.shortDescription}</p>

          <ul>
            <li>
              {experience.pricing.displayPrice} {experience.pricing.unit}
            </li>
            <li>{guestText}</li>
            <li>{durationText}</li>
            <li>
              {experience.cancellation.summary}&nbsp;:&nbsp;{experience.cancellation.text}
            </li>
          </ul>
        </section>

        <section className={styles.requestForm}>
          <BookingForm experience={experience} />
        </section>
      </div>
    </div>
  );
}
