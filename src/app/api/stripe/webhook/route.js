// @/app/api/stripe/webhook/route.js

// Webhookの受診用

import "server-only";
import { stripe } from "@/lib/server/stripe";
import { saveBooking } from "@/lib/server/saveBooking";
import { sendBookingEmail } from "@/lib/server/sendBookingEmail";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { buildScheduleText } from "@/lib/utils/buildSchedule";
import { formatBookingDateText } from "@/lib/utils/formatBookingDateText";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Responce("Missing Stripe signature or webhook secret", { status: 400 });
  }

  let event;
  const body = await request.text(); // raw bodyが必要

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return new Responce(`Webhook sigunature verification failed: ${error.message}`, { status: 400 });
  }

  // 決済完了（Checkout）
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // paid 以外は予約確定しない
    if (session.payment_status !== "paid") {
      return new Responce("Ignored: payment_status is not paid", { status: 200 });
    }

    const md = session.metadata || {};

    const experienceSlug = md.experienceSlug || "";
    const bookingDateISO = md.bookingDateISO || "";
    const guests = Number(md.guests || 0);
    const name = md.name || "";
    const email = md.email || "";

    // 必須が欠けている場合は200で返す（再送されても同じ）
    if (!experienceSlug ||
        !bookingDateISO ||
        !email ||
        !Number.isFinite(guests) ||
        guests < 1) {
      return new Response("Missing metadata", { status: 200 });
    }

    // Supabase 保存用 Date(UTC 00:00)
    const bookingDate = new Date(`${bookingDateISO}T00:00:00Z`);
    if (Number.isNaN(bookingDate.getTime())) {
      return new Responce("Invalid bookingDateISO", { status: 200});
    }

    try {
      // 予約を確定（＝ DB insert）
      await saveBooking({
        experienceSlug,
        bookingDate,
        guests,
        name,
        email,
      })
    } catch (error) {
      // webhook は再送されるので、ここで 500 にすると何度も再送される。
      // 既存の unique 制約で “二重挿入” は落ちる前提なので、200 で飲み込むのが安全。
      return new Responce(`Booking save skipped: ${String(error?.message || error)}`, { status: 200 });
    }

    try {
      // メール送信（ここで1回だけ）
      const exp = getExperienceBySlug(experienceSlug);
      const scheduleText = buildScheduleText(exp);
      const bookingDateText = formatBookingDateText(bookingISO);

      await sendBookingEmail({
        to: email,
        name,
        guests,
        experienceTitle: exp.title,
        scheduleText,
        bookingDateText
      });
    } catch (error) {
      // メール失敗でも決済・予約は成立しているので 200 で返す（運用で再送など）
      return new Responce(`Email failed: ${String(error.message || error)}`, { status: 200 });
    }
  }
  return new Responce("ok", { status: 200 });
}
