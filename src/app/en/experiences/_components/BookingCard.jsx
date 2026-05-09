// @/app/en/experiences/_components/BookingCard.jsx

import Link from "next/link";
import { getGuestText, getDurationText, getMinimumGuestText } from "@/lib/formatExperiences";
import styles from "../experiences.module.scss";

export default function BookingCard({ experience }) {
  const guestText = getGuestText(experience.pricing);
  const durationText = getDurationText(experience.duration);
  const minimunGuestText = getMinimumGuestText(experience.pricing);

  return (
    <aside className={styles.bookingCard}>
      <p className={styles.bookingPrice}>{experience.pricing.displayPrice}</p>
      <p className={styles.bookingUnit}>{experience.pricing.unit}</p>

      <ul className={styles.bookingMeta}>
        <li>{guestText}</li>
        <li>{durationText}</li>
        <li>{experience.cancellation.text}</li>
      </ul>

      {
        minimunGuestText && (
          <p className={styles.bookingNote}>{minimunGuestText}</p>
        )
      }

      <Link className="btn btn--regular" href={`${experience.bookingHref}`}>
        Book this experience
      </Link>
    </aside>
  );
}
