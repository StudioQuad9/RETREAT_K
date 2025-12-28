"use client";

import { useMemo, useState } from "react";
import { formatYen } from "@/lib/utils/formatYen";

export default function BookingForm({
  experienceSlug,
  priceJPY,
  capacity,
  submitBooking,
}) {
  const [guests, setGuests] = useState(1);

  const totalJPY = useMemo(() => {
    return priceJPY * guests;
  }, [priceJPY, guests]);

  function handleGuestsChange(e) {
    const value = Number(e.target.value);
    if (!Number.isFinite(value) || value < 1 || value > capacity) return;
    
    setGuests(value);
  }

  return (
    <form action={submitBooking}>
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
          Number of guests (1-{capacity})
          <input
            id="guests"
            name="guests"
            type="number"
            min="1"
            max={capacity}
            value={guests}
            onChange={handleGuestsChange}
            required
          />
        </label>
        <p>
          Total: ￥{formatYen(totalJPY)}
        </p>
        <input name="experience" type="hidden" value={experienceSlug} />
      </section>
  
      <button type="submit">Proceed</button>
    </form>
  );
  
}

// // フォームに入ってた文言。一応残す。後でどうするか考える。
// <p>
//   Capacity: up to {exp.capacity} guests per session.
//   <br />
//   This experience runs when the total participants reach {exp.minGuests} guests.
// </p>