// @/app/en/experiences/_components/BookingForm.jsx

"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import styles from "../booking.module.scss";

function isSameDate(date, dateString) {
  const targetDate = new Date(dateString);

  return (
    date.getFullYear() === targetDate.getFullYear() &&
    date.getMonth() === targetDate.getMonth() &&
    date.getDate() === targetDate.getDate()
  );
}

export default function BookingForm({ experience }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const availability = experience.availability;

  function isDateDisabled(date) {
    const day = date.getDay();
    const isUnavailableWeekday = !availability.availableWeekdays.includes(day);
    const isUnavailableDate = availability.unavailableDates.some(
      (dateString) => {
        return isSameDate(date, dateString);
      }
    );
    return isUnavailableWeekday || isUnavailableDate;
  }

  return (
    <>
      <h2>Request Details</h2>

      <form action="">
        <div className={styles.formField}>
          <label htmlFor="preferredDate">Preferred date</label>
          <DayPicker
            id="preferredDate"
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={isDateDisabled}
          />
          <input
            type="hidden"
            name="preferredDate"
            value={selectedDate ? selectedDate.toISOString() : ""}
          />
        </div>

        <label htmlFor="preferredTime">
          Preferred time
          <select id="preferredTime" name="preferredTime" defaultValue="">
            <option value="" disabled>
              select a time
            </option>
            {
              availability.timeSlots.map((time) => (
                <option value={time} key={time}>{time}</option>
              ))
            }
          </select>
        </label>

        <label htmlFor="numberOfGuests">
          Number of guests
          <input
            id="numberOfGuests"
            type="number"
            name="guestCount"
            min={experience.pricing.minGuests}
            max={experience.pricing.maxGuests}
          />
        </label>
        <label htmlFor="name">
          Your name
          <input id="name" type="text" name="name" />
        </label>
        <label htmlFor="email">
          Email
          <input id="email" type="email" name="email" />
        </label>
        <label htmlFor="message">
          Message
          <textarea id="message" name="message" rows="5" />
        </label>

        <button className="btn btn--regular" type="submit">
          Send Request
        </button>
      </form>
    </>
  );
}