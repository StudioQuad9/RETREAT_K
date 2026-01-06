// @/app/booking/BookingForm.jsx

"use client";

import {
  useState,
  useEffect,
  useActionState,
  useMemo,
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
  fetchSoldOutDates,
  submitBooking,
}) {
  // 関数型UIの基本構文に従って記述しあるので留意する。
  //  　　状態を宣言する
  //　　　↓
  //　　　状態からUIに必要な値を計算する
  //　　　↓
  //　　　状態が変わったら副作用を起こす
  //　　　↓
  //　　　それをJSXとして描画する

  // 1. UI状態（状態の宣言）
  //   人数のStateと更新用関数定義
  const [guests, setGuests] = useState(1);
  function handleGuestsChange(e) {
    const value = Number(e.target.value);
    if (!Number.isFinite(value) || value < 1 || value > capacity) return;

    setGuests(value);
  }
  //   日時のState
  const [selectedDate, setSelectedDate] = useState(null);
  //   更新用関数。disabled日をクリックしても「選択させない」ガード機能付き。
  const handleSelectDate = (date) => {
    if (!date) {
      setSelectedDate(null); // 初期値に戻す。
      return;
    }
    if (isDisabledDate(date)) {
      return; // ここで止めるので「満席日はクリックできない」になる
    }
    setSelectedDate(date);
  };

  //   DayPickerが今表示している月
  const [viewMonth, setViewMonth] = useState(() => new Date());

  //   満席日一覧（"YYYY-MM-DD"）をSetで保持
  const [soldOutSet, setSoldOutSet] = useState(() => new Set());

  // 2. 非同期UI状態（状態の宣言）
  //   残席表示用のState
  const [seatInfo, setSeatInfo] = useState(null); // { bookedCount, remainingCount}
  const [seatError, setSeatError] = useState("");
  // この場合、UI の管理を React に任せる。
  // 席の状態をサーバーに問い合わせている間は、false を返し、
  // 問い合わせが終了したら true を返す。
  // サーバーへの問い合わせを指示したり、
  // 席の状態を更新するための関数を走らせたりする
  // トリガーが startSeatTransition()関数。凄い。
  const [isSeatPending, startSeatTransition] = useTransition();

  // 3. フォーム送信状態（useActionState）（状態の宣言）
  //   これは「form の送信処理（＝ submitBooking）」の状態を、
  //   React が公式に監視・管理するための仕組み。
  const [state, formAction, isPending] = useActionState(
    async (_prev, formData) => submitBooking(formData),
    { ok: true, error: "" }
  );

  // 4. 派生値（状態から計算される値）
  //   合計金額
  const totalJPY = useMemo(() => {
    return priceJPY * guests;
  }, [priceJPY, guests]);

  //  「日」単位で比較（時刻のズレで今日が弾かれないように）
  const startOfDay = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  //   最終的な disabled 判定（曜日/過去日 + 満席日）
  //   引数 data は、JSのDate オブジェクトを期待している。
  const isDisabledDate = (date) => {
    if (!date) return false;
    const today0 = startOfDay(new Date());
    const day0 = startOfDay(date);
    // 今日より以前の日付は disabled にする。
    if (day0 < today0) return true;
    // 体験実施曜日以外は desabled にする。
    if (!allowedWeekdays.includes(date.getDay())) return true;
    // 予約満席になった日は desabled にする。
    if (soldOutSet.has(toISODateString(date))) return true;
    
    return false;
  };

  // 5. 副作用（状態変化に反応する副作用）
  //   日付を選ぶと同時に残席取得
  useEffect(() => {
    let cancelled = false;

    if (!selectedDate) {
      setSeatInfo(null);
      setSeatError("");
      return;
    }

    setSeatInfo(null); // 日付が変わった瞬間は「未取得」に戻す
    setSeatError("");

    const bookingDateISO = toISODateString(selectedDate);

    startSeatTransition(async () => {
      try {
        // result は { bookingCount, remainingCount } を期待する。
        const result = await checkRemainingSeats(
          experienceSlug,
          bookingDateISO,
          capacity
        );
        if (cancelled) return;

        // 更新用関数を発火させる。
        setSeatInfo(result);

        // 満席（＝残席0）ならその日は選べない扱いにする（事故防止）
        if (Number(result?.remainingCount) <= 0) {
          setSeatError(
            "This date is fully booked. Please choose another date."
          );
        }
      } catch (e) {
        if (cancelled) return;
        setSeatError("Failed to check remaining seats. Please try again.");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, experienceSlug, capacity, checkRemainingSeats]);

  // 表示月が変わったら、その月の満席日を取得して soldOutSet に反映
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!fetchSoldOutDates) return;
      try {
        const year = viewMonth.getFullYear();
        const month1to12 = viewMonth.getMonth() + 1;

        const res = await fetchSoldOutDates(
          experienceSlug,
          year,
          month1to12,
          capacity
        );
        if (cancelled) return;

        const list = Array.isArray(res?.soldOutDates) ? res.soldOutDates : [];
        setSoldOutSet(new Set(list));
      } catch (e) {
        if (cancelled) return;
        // 取得失敗時は「満席disableなし」で続行（submitBooking側で最終防衛できる）
        setSoldOutSet(new Set());
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [viewMonth, experienceSlug, capacity, fetchSoldOutDates]);

  return (
    <form action={formAction}>
      <section>
        <h3>Select Date</h3>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleSelectDate}
          // 今日より前の日付を表示も選択もさせない
          //  判定の基準を関数にして設けて、それを属性の値として投げるだけで、
          //  DayPickerコンポーネントがあとはHTMLの表示に落とし込んでくれる。
          disabled={isDisabledDate}
          month={viewMonth}
          onMonthChange={setViewMonth}
          // 曜日を『Sun, Mon, Tue, Wed, Thu, Fri, Sat』と表示させる。
          formatters={{
            formatWeekdayName: (selectedDate) =>
              selectedDate.toLocaleDateString("en-US", { weekday: "short" }),
          }}
        />
        {/* 残席表示 */}
        {selectedDate && (
          <p>
            {isSeatPending && "Checking availability..."}
            {!isSeatPending && seatInfo && (
              <>
                {seatInfo.remainingCount > 0 ? (
                  <>Remaining seats: {seatInfo.remainingCount}</>
                ) : (
                  <span style={{ color: "red" }}>Sold out</span>
                )}
              </>
            )}
          </p>
        )}
        {seatError && <p style={{ color: "red" }}>{seatError}</p>}

        <input
          type="hidden"
          name="selectedDate"
          // DayPickerから送られたjsオブジェクトを
          // 文字列に変換して親コンポーネントへ渡す。
          value={selectedDate ? toISODateString(selectedDate) : ""}
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

      {!selectedDate && <p style={{ color: "red" }}>Please select a date.</p>}

      {!state.ok && state.error && (
        <p style={{ color: "red" }}>{state.error}</p>
      )}
      <button
        type="submit"
        disabled={
          !selectedDate ||
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