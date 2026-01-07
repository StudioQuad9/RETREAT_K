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
    console.error("[webhook] missing signature or STRIPE_WEBHOOK_SECRET");
    return new Response("Missing Stripe signature or webhook secret", {
      status: 400,
    });
  }

  const body = await request.text(); // raw body 必須

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[webhook] signature verification failed:", error);
    return new Response(
      `Webhook signature verification failed: ${error.message}`,
      { status: 400 }
    );
  }

  console.log("[webhook] type:", event.type, "id:", event.id);

  // 決済完了（Checkout）
  if (event.type !== "checkout.session.completed") {
    return new Response("ignored", { status: 200 });
  }

  const session = event.data.object;

  if (session.payment_status !== "paid") {
    return new Response("ignored: not paid", { status: 200 });
  }

  // console.log("[webhook] session.id:", session.id);
  // console.log("[webhook] payment_status:", session.payment_status);
  // console.log("[webhook] metadata:", session.metadata);

  // // paid 以外は予約確定しない
  // if (session.payment_status !== "paid") {
  //   console.log("[webhook] ignored: payment_status is not paid");
  //   return new Response("ignored: not paid", { status: 200 });
  // }

  const md = session.metadata || {};

  const experienceSlug = md.experienceSlug || "";
  const bookingDateISO = md.bookingDateISO || "";
  const guests = Number(md.guests || 0);
  const name = md.name || "";
  const email = md.email || "";

  // 必須メタデータが無いなら確定しない（200で返す）
  if (
    !experienceSlug ||
    !bookingDateISO ||
    !email ||
    !Number.isFinite(guests) ||
    guests < 1
  ) {
    console.error("[webhook] missing metadata fields:", {
      experienceSlug,
      bookingDateISO,
      guests,
      email,
    });
    return new Response("Missing metadata", { status: 200 });
  }

  // Supabase 保存用 Date(UTC 00:00)
  const bookingDate = new Date(`${bookingDateISO}T00:00:00Z`);
  // バリデーション
  if (Number.isNaN(bookingDate.getTime())) {
    console.error("[webhook] invalid bookingDateISO:", bookingDateISO);
    return new Response("Invalid bookingDateISO", { status: 200 });
  }

  let inserted = false;

  try {
    const res = await saveBooking({
      stripeSessionId: session.id,
      experienceSlug,
      bookingDate,
      guests,
      name,
      email,
    });

    inserted = Boolean(res?.inserted);
    console.log("[webhook] saveBooking result:", res);
  } catch (error) {
    const msg = String(error?.message || error);

    // ✅ ここが重要：duplicate は「想定内」なので 200 で返して終わる
    if (msg.includes("bookings_unique")) {
      console.log(
        "[webhook] DUPLICATE by bookings_unique -> OK ignore (no email)"
      );
      return new Response("duplicate ignored", { status: 200 });
    }

    if (msg.includes("bookings_stripe_session_id_unique")) {
      console.log(
        "[webhook] DUPLICATE by stripe_session_id -> OK ignore (no email)"
      );
      return new Response("duplicate ignored", { status: 200 });
    }

    // それ以外は本当のエラー
    console.error("[webhook] saveBooking failed (unexpected):", msg);
    return new Response(msg, { status: 500 });
  }  

  // const { inserted } = await saveBooking({
  //   stripeSessionId: session.id,
  //   experienceSlug,
  //   bookingDate,
  //   guests,
  //   name,
  //   email,
  // });

  // // stripeSessionId を渡す
  // let inserted;
  // try {
  //   const res = await saveBooking({
  //     stripeSessionId: session.id,
  //     experienceSlug,
  //     bookingDate,
  //     guests,
  //     name,
  //     email,
  //   });
  //   inserted = res.inserted;
  //   console.log("[webhook] saveBooking:", res);
  // } catch (error) {
  //   console.error("[webhook] saveBooking failed:", error);
  //   return new Response(String(error?.message || error), { status: 500 });
  // }

  if (inserted) {
    try {
      const exp = getExperienceBySlug(experienceSlug);
      const scheduleText = buildScheduleText(exp);
      const bookingDateText = formatBookingDateText(bookingDateISO);

      await sendBookingEmail({
        to: email,
        name,
        guests,
        experienceTitle: exp.title,
        scheduleText,
        bookingDateText,
      });

      console.log("[webhook] sent email ✅");
    } catch (error) {
      console.error("[webhook] sendBookingEmail failed:", error);
      return new Response(String(error?.message || error), { status: 500 });
    }
  } else {
    console.log("[webhook] skip email (already saved)");
  }

  // // 1) DB保存
  // try {
  //   // 予約を確定（＝ DB insert）
  //   await saveBooking({
  //     experienceSlug,
  //     bookingDate,
  //     guests,
  //     name,
  //     email,
  //   });
  //   console.log("[webhook] saved booking ✅");
  // } catch (error) {
  //   console.error("[webhook] saveBooking failed ❌:", error);
  //   // いまはデバッグ優先で 500 にして、stripe listen 側でも失敗が見えるようにする
  //   // webhook は再送されるので、ここで 500 にすると何度も再送される。
  //   // 既存の unique 制約で “二重挿入” は落ちる前提なので、200 で飲み込むのが安全。
  //   return new Response(
  //     `saveBooking failed: ${String(error?.message || error)}`,
  //     { status: 500 }
  //   );
  // }

  // // 2) メール送信
  // try {
  //   // メール送信（ここで1回だけ）
  //   const exp = getExperienceBySlug(experienceSlug);
  //   const scheduleText = buildScheduleText(exp);
  //   const bookingDateText = formatBookingDateText(bookingDateISO);

  //   await sendBookingEmail({
  //     to: email,
  //     name,
  //     guests,
  //     experienceTitle: exp.title,
  //     scheduleText,
  //     bookingDateText,
  //   });

  //   console.log("[webhook] sent email ✅");
  // } catch (error) {
  //   console.error("[webhook] sendBookingEmail failed ❌:", error);
  //   return new Response(
  //     `sendBookingEmail failed: ${String(error?.message || error)}`,
  //     { status: 500 }
  //   );
  // }

  return new Response("ok", { status: 200 });
}