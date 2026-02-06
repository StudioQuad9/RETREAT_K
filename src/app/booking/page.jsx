// @/app/booking/page.jsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getRemainingSeats } from "@/lib/server/getRemainingSeats";
import { getSoldOutDatesForMonth } from "@/lib/server/getSoldOutDatesForMonth";
import { stripe } from "@/lib/server/stripe";
import { formatDuration } from "@/lib/utils/formatDuration";
import { formatYen } from "@/lib/utils/formatYen";
import { buildScheduleText, buildScheduleIndex } from "@/lib/utils/buildSchedule";
import BookingForm from "@/app/booking/BookingForm";

export default async function BookingPage({ searchParams }) {
  const params = await searchParams;
  const experienceSlug = params?.experience || "";
  // getExperienceBySlug()関数は、確認装置。
  // 登録している体験の中に、該当する名称のものがあるかどうかをチェックした上で、
  // その登録している体験の名称を返すようにしている。
  const exp = experienceSlug ? getExperienceBySlug(experienceSlug) : null;

  // 日付選択時に残席を返すServer Action（関数）（client component の BookingForm から呼ぶ）
  // 期待する値は、日付に紐づいた、{ bookedCount, remainingCount }。
  async function checkRemainingSeats(experienceSlug, bookingDateISO, capacity) {
    "use server";
    return await getRemainingSeats({
      experienceSlug,
      bookingDateISO,
      capacity,
    });
  }

  // 表示中の月の「満席日一覧」を返すServer Action（BookingFormから呼ぶ）
  async function fetchSoldOutDates(experienceSlug, year, month1to12, capacity) {
    "use server";
    return await getSoldOutDatesForMonth({
      experienceSlug,
      year,
      month1to12,
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

    // form
    // フォームから送られたデータ
    const experience = String(formData.get("experience") || "");
    const name = String(formData.get("name") || "");
    const emailRaw = String(formData.get("email") || "");
    const email = emailRaw.trim().toLocaleLowerCase();
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

    // 既存予約チェック（同一体験・同一日・同一emailなら支払いへ進ませない）
    const { data: existing, error: selErr } = await supabaseAdmin
      .from("bookings")
      .select("id")
      .eq("experience_slug", experience)
      .eq("booking_date", bookingDateISO)
      .eq("email", email)
      .maybeSingle();
    
    if (selErr) {
      return { ok: false, error: `Failed to check existing booking: ${selErr.message}`};
    }
    if (existing?.id) {
      return { ok: false, error: "This booking already exists for the date (same email)."}
    }

    // Stripe Checkout へ（最小安全：決済完了は Webhook 側で確定＆メール送信）
    const siteURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // 1人単価 × 人数
      line_items: [
        {
          quantity: guests,
          price_data: {
            currency: "jpy",
            unit_amount: bookedExp.priceJPY, // 円は最小単位＝1円
            product_data: { name: bookedExp.title },
          },
        },
      ],
      customer_email: email,
      metadata: {
        experienceSlug: experience,
        bookingDateISO,
        guests: String(guests),
        name,
        email,
      },
      success_url: `${siteURL}/booking/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteURL}/booking?experience=${encodeURIComponent(
        experience
      )}&canceled=1`,
    });
    console.log("[submitBooking] created session:", session.id, session.url);
    redirect(session.url);
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
    <div className="container booking">
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
        fetchSoldOutDates={fetchSoldOutDates}
        submitBooking={submitBooking}
      />

      <div className="next-action">
        <Link className="btn btn--primary" href={`/experiences/${exp.slug}`}>
          Back to details
        </Link>
      </div>
    </div>
  );
}