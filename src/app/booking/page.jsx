// @/app/booking/page.jsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { sendBookingEmail } from "@/lib/server/sendBookingEmail";
import { saveBooking } from "@/lib/server/saveBooking";
import { getRemainingSeats } from "@/lib/server/getRemainingSeats";
import { formatDuration } from "@/lib/utils/formatDuration";
import { formatYen } from "@/lib/utils/formatYen";
import { buildScheduleText, buildScheduleIndex } from "@/lib/utils/buildSchedule";
import { formatBookingDateText } from "@/lib/utils/formatBookingDateText";
import BookingForm from "@/app/booking/BookingForm";

export default async function BookingPage({ searchParams }) {
  const params = await searchParams;
  const experienceSlug = params?.experience || "";
  // getExperienceBySlug()関数は、確認装置。
  // 登録している体験の中に、該当する名称のものがあるかどうかをチェックした上で、
  // その登録している体験の名称を返すようにしている。
  const exp = experienceSlug ? getExperienceBySlug(experienceSlug) : null;

  // 日付選択時に残席を返すServer Action（関数）（client component の BookingForm から呼ぶ）
  async function checkRemainingSeats(experienceSlug, bookingDateISO, capacity) {
    "use server";
    return await getRemainingSeats({
      experienceSlug,
      bookingDateISO,
      capacity,
    });
  }

  // 予約を送信するためのServer Action（関数）を上と同じ理由で親コンポーネントで定義する
  async function submitBooking(formData) {
    "use server";

    // date
    // カレンダーでゲストが予約した日付
    // 文字列で渡ってきた日付のデータをjsのdateオブジェクトへ復号する。
    const dateRaw = String(formData.get("selectedDate") || "");
    if (!dateRaw) {
      return { ok: false, error: "Please select a date." };
    }
    // フォームから渡ってきた dataRaw は "YYYY-MM-DD" を想定できるので
    // 変数名はあえて "bookingDateISO" としている。
    const bookingDateISO = dateRaw;
    // Supabase保存などでDateが必要な箇所用（UTC 00:00として生成）
    const bookingDate = new Date(`${bookingDateISO}T00:00:00Z`);
    if (Number.isNaN(bookingDate.getTime())) {
      return { ok: false, error: "Invalid date." };
    }

    // form
    // フォームから送られたデータ
    const experience = String(formData.get("experience") || "");
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const guests = Number(formData.get("guests") || 0);

    // 人数についてバリデーション
    if (!Number.isFinite(guests) || guests < 1) {
      return { ok: false, error: "Invalid guests" };
    }
    const bookedExp = experience ? getExperienceBySlug(experience) : null;
    if (!bookedExp) return { ok: false, error: "Invalid experience" };
    if (guests > bookedExp.capacity) {
      return {
        ok: false,
        error: `Guests exceeds capacity (${bookedExp.capacity})`,
      };
    }

    // 残席数（保存前）
    const { remainingCount } = await getRemainingSeats({
      experienceSlug: experience,
      bookingDateISO,
      capacity: bookedExp.capacity,
    });

    if (guests > remainingCount) {
      return {
        ok: false,
        error: `Not enough seats. Remaining: ${remainingCount}`,
      };
    }

    // save(unique制約で落ちる可能性)
    try {
      // Supabaseに予約の値を保存する
      // 保存　ここで重複が起きうる
      await saveBooking({
        experienceSlug: experience,
        bookingDate,
        guests,
        name,
        email,
      });
    } catch (error) {
      // “重複予約” をユーザー向け文言に変換
      const msg = String(error?.message || error);

      if (msg.includes("duplicate key value violates unique constraint")) {
        return {
          ok: false,
          error: "This booking already exists for that date (same email).",
        };
      }
      return { ok: false, error: "Failed to save booking. Please try again." };
    }

    // Email
    // 体験スケジュールの日付と曜日
    const scheduleText = buildScheduleText(bookedExp);

    // 予約された日付
    // jsのDateオブジェクトを任意の文字列へ変更
    const bookingDateText = formatBookingDateText(bookingDateISO);

    // 予約の内容を送信する本体にあたる関数
    await sendBookingEmail({
      to: email,
      name,
      guests,
      experienceTitle: bookedExp.title,
      scheduleText,
      bookingDateText,
    });

    // クエリを生成してリダイレクトする
    const query = new URLSearchParams({
      experience,
      name,
      email,
      guests: String(guests),
      date: bookingDateISO,
    });
    redirect(`/booking/complete?${query.toString()}`);
  }

  if (!exp) {
    return (
      <main>
        <h1>Booking</h1>
        <p>Please select an experience first.</p>
        <Link href="/experiences">Go to Expriences</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Booking</h1>

      <section>
        <h2>{exp.title}</h2>
        <div className="spec">Schedule: {buildScheduleText(exp)}</div>
        <div className="spec">
          Duration: {formatDuration(exp.durationMinutes)}
        </div>
        <div className="spec">Price: ￥{formatYen(exp.priceJPY)} / person</div>
      </section>

      <BookingForm
        experienceSlug={exp.slug}
        priceJPY={exp.priceJPY}
        capacity={exp.capacity}
        allowedWeekdays={buildScheduleIndex(exp)}
        checkRemainingSeats={checkRemainingSeats}
        submitBooking={submitBooking}
      />

      <div className="enter-btn">
        <Link href={`/experiences/${exp.slug}`}>Back to details</Link>
      </div>
    </main>
  );
}