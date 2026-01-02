// @/app/booking/BookingForm.jsx

"use client";

import {
  useActionState,
  useMemo,
  useState,
  useEffect,
  useTransition
} from "react";
import { DayPicker } from "react-day-picker";
import { formatYen } from "@/lib/utils/formatYen";
import { toISODateString } from "@/lib/utils/toISODateString";

export default function BookingForm({
  experienceSlug,
  priceJPY,
  capacity,
  allowedWeekdays,
  checkRemainingSeats,
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

  // 残席表示用
  const [seatInfo, setSeatInfo] = useState(null); // { bookedCount, remainingCount}
  const [seatError, setSeatError] = useState("");
  const [isSeatPending, startSeatTransition] = useTransition();

  // フォーム送信用　useActionState
  const [state, formAction, isPending] = useActionState(
    async (_prev, formData) => submitBooking(formData), 
    { ok: true, error: "" }
  );

  // 合計金額
  const totalJPY = useMemo(() => {
    return priceJPY * guests;
  }, [priceJPY, guests]);

  // 選べない日をまとめて定義
  const disabledRules = [
    { before: new Date() },
    (day) => !allowedWeekdays.includes(day.getDay()),
  ];

  // 日付を選ぶと同時に残席取得
  useEffect(() => {
    let cancelled = false;

    if (!date) {
      setSeatInfo(null);
      setSeatError("");
      return;
    }

    setSeatInfo(null); // 日付が変わった瞬間は「未取得」に戻す
    setSeatError("")

    const bookingDateISO = toISODateString(date);

    startSeatTransition(async () => {
      try {
        const result = await checkRemainingSeats(
          experienceSlug,
          bookingDateISO,
          capacity
        );
        if (cancelled) return;

        // resultは{ bookedCount, remainigCount }を想定
        setSeatInfo(result);

        // 満席（＝残席0）ならその日は選べない扱いにする（事故防止）
        if (Number(result?.remainingCount) <= 0) {
          setSeatError("This date is fully booked. Please choose another date.");
        }
      } catch (e) {
        if (cancelled) return;
        setSeatError("Failed to check remaining seats. Please try again.");
      }
    });

    return () => { cancelled = true};
  }, [date, experienceSlug, capacity, checkRemainingSeats]);

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
        {/* 残席表示 */}
        {date && (
          <p>
            {isSeatPending && "Checking availability..."}
            {!isSeatPending && seatInfo && (
            <>
              {
                seatInfo.remainingCount > 0
                  ? (<>Remaining seats: {seatInfo.remainingCount}</>)
                  : (<span style={{ color: "red" }}>Sold out</span>)
              }
            </>
            )}
          </p>
        )}
        {seatError && <p style={{ color: "red" }}>{seatError}</p>}

        <input
          type="hidden"
          name="date"
          // DayPickerから送られたjsオブジェクトを
          // 文字列に変換して親コンポーネントへ渡す。
          value={date ? toISODateString(date) : ""}
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

      {!date && <p style={{ color: "red" }}>Please select a date.llllllllll</p>}

      {!state.ok && state.error && (
        <p style={{ color: "red" }}>{state.error}</p>
      )}
      <button
        type="submit"
        disabled={
          !date || 
          isPending || 
          isSeatPending || 
          !seatInfo ||
          seatInfo.remainingCount === 0
        }
      >
        {isPending ? "Processing..." : "Proceed"}
      </button>
    </form>
  ); 
}