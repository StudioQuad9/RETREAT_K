// @/app/en/experiences/_components/BookingForm.jsx

"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import styles from "../booking.module.scss";

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDate(date, dateString) {
  return formatDateKey(date) === dateString;
}

export default function BookingForm({ experience }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const availability = experience.availability || {};
  // 利用可能な曜日
  const availableWeekdays = availability.availableWeekdays || [];
  // 利用不可の日付
  const unavailableDates = availability.unavailableDates || [];
  // 利用時間の選択肢
  const timeSlots = availability.timeSlots || [];

  const today = startOfDay(new Date());
  // 今日から7日後以降を予約可能にするため、その基準日を取得。
  const minSelectableDate = startOfDay(addDays(today, 7));
  // 今日の日付から90日間予約受付を行う、その基準日を取得。
  const maxSelectableDate = startOfDay(addDays(today, 90));

  function isDateDisabled(date) {
    const targetDate = startOfDay(date);
    const day = targetDate.getDay();
    const isBeforeMinDate = targetDate < minSelectableDate;
    const isAfterMaxDate = targetDate > maxSelectableDate;
    const isUnavailableWeekday = !availableWeekdays.includes(day);
    const isUnavailableDate = unavailableDates.some((dateString) => {
      return isSameDate(targetDate, dateString);
    });
    return (
      isBeforeMinDate ||
      isAfterMaxDate ||
      isUnavailableWeekday || 
      isUnavailableDate
    );
  }

  return (
    <>
      <h2>Request Details</h2>

      <form className={styles.bookingForm} action="">
        <div className={styles.formField}>
          <label htmlFor="preferredDate">Preferred date</label>
          <div className={styles.calendarPanel}>
            <DayPicker
              id="preferredDate"
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              timeZone="Asia/Tokyo"
              showOutsideDays
            />
          </div>
          <input
            type="hidden"
            name="preferredDate"
            value={
              selectedDate 
                ? formatDateKey(selectedDate)
                : ""
            }
          />
          <p className={styles.timezoneNote}>
            All dates and times are based on Kyoto local time (JST).
          </p>
        </div>

        <label htmlFor="preferredTime">
          Preferred time
          <select id="preferredTime" name="preferredTime" defaultValue="">
            <option value="" disabled>
              select a time
            </option>
            {timeSlots.map((time) => (
              <option value={time} key={time}>
                {time}
              </option>
            ))}
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