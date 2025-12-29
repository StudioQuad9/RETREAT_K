// @/app/booking/page.jsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { sendBookingEmail } from "@/lib/server/sendBookingEmail";
import { formatDuration } from "@/lib/utils/formatDuration";
import { formatYen } from "@/lib/utils/formatYen";
import { buildScheduleText, buildScheduleIndex } from "@/lib/utils/buildSchedule";
import BookingForm from "@/app/booking/BookingForm";

export default async function BookingPage({ searchParams }) {
  const params = await searchParams;
  const experienceSlug = params?.experience || "";
  const exp = experienceSlug ? getExperienceBySlug(experienceSlug) : null;

  // BookingFormコンポーネントとのやり取り用関数を親で定義する
  async function submitBooking(formData) {
    "use server";

    // カレンダーでゲストが予約した日付
    const dateRaw = String(formData.get("date") || "");
    if (!dateRaw) throw new Error("Date is required");
    const bookingDate = new Date(dateRaw);
    if (Number.isNaN(bookingDate.getTime())) {
      throw new Error("Invalid date");
    }

    // フォームから送られたデータ
    const experience = String(formData.get("experience") || "");
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const guests = Number(formData.get("guests") || 0);

    // 人数についてバリデーション
    if (!Number.isFinite(guests) || guests < 1) {
      throw new Error("Invalid guests");
    }
    const bookedExp = experience ? getExperienceBySlug(experience) : null;
    if (!bookedExp) throw new Error("Invalid experience");
    if (guests > bookedExp.capacity) {
      throw new Error(`Guests exceeds capacity (${bookedExp.capacity})`);
    }

    // 体験スケジュールの日付と曜日
    const scheduleText = bookedExp ? buildScheduleText(bookedExp) : "";

    // 予約の内容を送信する本体にあたる関数
    await sendBookingEmail({
      to: email,
      name,
      guests,
      experienceTitle: bookedExp?.title ?? "",
      scheduleText,
    });

    const date = bookingDate.toISOString();
    const query = new URLSearchParams({
      experience,
      name,
      email,
      guests:
      String(guests),
      date
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
        submitBooking={submitBooking}
      />

      <div className="enter-btn">
        <Link href={`/experiences/${exp.slug}`}>Back to details</Link>
      </div>
    </main>
  );
}