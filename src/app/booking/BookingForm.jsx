// @/app/booking/BookingForm.jsx

"use client";

import { useActionState, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { formatYen } from "@/lib/utils/formatYen";

export default function BookingForm({
  experienceSlug,
  priceJPY,
  capacity,
  allowedWeekdays,
  submitBooking,
}) {
  // 人数のState
  const [guests, setGuests] = useState(1);
  function handleGuestsChange(e) {
    const value = Number(e.target.value);
    if (!Number.isFinite(value) || value < 1 || value > capacity) return;
    
    setGuests(value);
  }
  // 日時のState
  const [date, setDate] = useState(null);

  // useActionState
  const [state, formAction, isPending] = useActionState(
    async (_prev, formData) => submitBooking(formData), 
    { ok: true, error: "" }
  );

  const totalJPY = useMemo(() => {
    return priceJPY * guests;
  }, [priceJPY, guests]);

  // 選べない日をまとめて定義
  const disabledRules = [
    { before: new Date() },
    (day) => !allowedWeekdays.includes(day.getDay()),
  ];

  return (
    <form action={formAction}>
      <section>
        <h3>Select Date</h3>
        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabledRules}
          // //今日より前の日付を表示も選択もさせない
          // disabled={{ before: new Date() }}
          // 曜日を『Sun, Mon, Tue, Wed, Thu, Fri, Sat』と表示させる。
          formatters={{
            formatWeekdayName: (date) =>
              date.toLocaleDateString("en-US", { weekday: "short" }),
          }}
        />

        <input
          type="hidden"
          name="date"
          // DayPickerから送られたjsオブジェクトを
          // 文字列に変換して親コンポーネントへ渡す。
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

      {!date && <p style={{ color: "red" }}>Please select a date.</p>}
      {!state.ok && state.error && (
        <p style={{ color: "red" }}>{state.error}</p>
      )}
      <button type="submit" disabled={!date || isPending}>
        {isPending ? "Processing..." : "Proceed"}
      </button>
    </form>
  ); 
}