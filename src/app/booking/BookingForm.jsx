// @/app/booking/BookingForm.jsx

"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { formatYen } from "@/lib/utils/formatYen";

export default function BookingForm({
  experienceSlug,
  priceJPY,
  capacity,
  submitBooking,
}) {
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState(null);

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
        <h3>Select Date</h3>
        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={{ before: new Date() }} //今日より前の日付を表示も選択もさせない
          // 曜日を『Sun, Mon, Tue, Wed, Thu, Fri, Sat』と表示させる。
          formatters={{
            formatWeekdayName: (date) => date.toLocaleDateString("en-US", { weekday: "short"})
          }}
        />

        {!date && <p style={{ color: "red" }}>Please select a date.</p>}

        <input 
          type="hidden" 
          name="date" 
          value={date ? date.toISOString() : ""} 
        />
      </section>

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

        <p>Total: ￥{formatYen(totalJPY)}</p>

        <input name="experience" type="hidden" value={experienceSlug} />
      </section>

      <button type="submit" disabled={!date}>Proceed</button>
    </form>
  );
  
}

// // フォームに入ってた文言。一応残す。後でどうするか考える。
// <p>
//   Capacity: up to {exp.capacity} guests per session.
//   <br />
//   This experience runs when the total participants reach {exp.minGuests} guests.
// </p>