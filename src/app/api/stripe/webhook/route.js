// @/app/api/stripe/webhook/route.js

// Webhookの受診用（確定処理はここで行う）

import "server-only";
import { stripe } from "@/lib/server/stripe";
import { saveBooking } from "@/lib/server/saveBooking";
import { sendBookingEmail } from "@/lib/server/sendBookingEmail";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { buildScheduleText } from "@/lib/utils/buildSchedule";
import { formatBookingDateText } from "@/lib/utils/formatBookingDateText";
// import { FunctionsFetchError } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 本番はログを絞る（必要なら env で切り替え）
const DEBUG = process.env.NODE_ENV !== "production";
const log = (...args) => DEBUG && console.log(...args);
const warn = (...args) => console.warn(...args);
const err = (...args) => console.error(...args);

function ok(message = "ok") {
  return new Response(message, { status: 200 });
}

function badRequest(message = "bad request") {
  return new Response(message, { status: 400 });
}

function serverError(message = "server error") {
  return new Response(message, { status: 500 });
}

function includesAny(message, list) {
  return list.some((s) => message.includes(s));
}

// 1) Stripe署名検証（raw body 必須）
async function constructStripeEvent(request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return { error: "Missing Stripe signature or STRIPE_WEBHOOK_SECRET"};
  }

  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    return { event };
  } catch (error) {
    return { error: `Webhook signature verification failed: ${error.message}`};
  }
}

// 2) Checkout完了イベントだけ処理する（他は無視）
function extractCheckoutSession(event) {
  if (event?.type !== "checkout.session.completed") return { ignored: true };

  const session = event.data.object;

  // paid 以外は確定しない（カード認証などで未払いのケースを弾く）
  if (session?.payment_status !== "paid") return { ignored: true };

  return { session };
}

function parseMetadata(session) {
  const md = session?.metadata || {};

  const experienceSlug = md.experienceSlug || "";
  const bookingDateISO = md.bookingDateISO || "";
  const guests = Number(md.guests || 0);
  const name = md.name || "";
  const email = md.email || "";

  const missing =
    !experienceSlug ||
    !bookingDateISO ||
    !email ||
    !Number.isFinite(guests) ||
    guests < 1;
  
  if (missing) {
    return {
      error: "Missing metadata",
      details: { experienceSlug, bookingDateISO, guests, email },
    };
  }

  const bookingDate = new Date(`${bookingDateISO}T00:00:00Z`);
  if (Number.isNaN(bookingDate.getTime())) {
    return { error: "Invalid bookingDateISO", details: { bookingDateISO } };
  }

  return {
    data: {
      stripeSessionId: session.id,
      experienceSlug,
      bookingDateISO,
      bookingDate,
      guests,
      name,
      email,
    }
  };
}

async function savebookingWithDuplicateHandling(payload) { 
  try {
    const res = await saveBooking(payload);
    const inserted = Boolean(res?.inserted);
    return { inserted, res };
  } catch (error) {
    const msg = String(error?.message || error);
    // duplicate は「想定内」：Stripeの再送／二重クリック等があっても壊れないように 200 で握る
    if (includesAny(msg, [
      "bookings_unique",
      "bookings_stripe_session_id_unique",
      "duplicate key value violates unique constraint",
    ])) {
      return { duplicate: true, msg };
    }

    return { error: msg };
  }
}

async function sendEmailIfInserted({
  inserted,
  experienceSlug,
  bookingDateISO,
  guests,
  name,
  email,
}) {
  if (!inserted) return { sent: false };

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

  return { sent: true };
}

export async function POST(request) {
  // A) 署名検証
  const { event, error: verifyError } = await constructStripeEvent(request);
  if (verifyError) {
    err("[webhook] verify failed:", verifyError);
    return badRequest(verifyError);
  }

  log("[webhook] type:", event.type, "id:", event.id);

  // B) 対象イベントのみ処理
  const { session, ignored } = extractCheckoutSession(event);
  if (ignored) return ok("ignored");

  // C) metadataを解釈（予約情報）
  const { data, error: metaError, details } = parseMetadata(session);
  if (metaError) {
    warn("[webhook] metadata invalid:", metaError, details || "");
    // 再送されても同じなので 200 で返す（Stripeを無限リトライにしない）
    return ok(metaError);
  }

  // D) DB保存（duplicateは想定内で握る）
  const saveResult = await savebookingWithDuplicateHandling({
    stripeSessionId: data.stripeSessionId,
    experienceSlug: data.experienceSlug,
    bookingDate: data.bookingDate,
    guests: data.guests,
    name: data.name,
    email: data.email,
  });

  if (saveResult.error) {
    err("[webhook] saveBooking failed", saveResult.error);
    return serverError(saveResult.error);
  }

  if (saveResult.duplicate) {
    log("[webhook] duplicate ignored:", saveResult.msg);
    return ok("duplicate ignored");
  }

  log("[webhook] saved booking ✅", saveResult.res);

  // E) inserted のときだけメール送信
  try {
    const mail = await sendEmailIfInserted({
      inserted: saveResult.inserted,
      experienceSlug: data.experienceSlug,
      bookingDateISO: data.bookingDateISO,
      guests: data.guests,
      name: data.name,
      email: data.email,
    });

    if (mail.sent) log("[webhook] sent email ✅");
    else log("[webhook] skip email (already saved)");
  } catch (error) {
    const msg = String(error?.message || error);
    err("[webhook] sendBookingEmail failed:", msg);
    return serverError(msg);
  }

  return ok("ok");
}

// export async function POST(request) {
//   const signature = request.headers.get("stripe-signature");
//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

//   if (!signature || !webhookSecret) {
//     console.error("[webhook] missing signature or STRIPE_WEBHOOK_SECRET");
//     return new Response("Missing Stripe signature or webhook secret", {
//       status: 400,
//     });
//   }

//   const body = await request.text(); // raw body 必須

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
//   } catch (error) {
//     console.error("[webhook] signature verification failed:", error);
//     return new Response(
//       `Webhook signature verification failed: ${error.message}`,
//       { status: 400 }
//     );
//   }

//   console.log("[webhook] type:", event.type, "id:", event.id);

//   // 決済完了（Checkout）
//   if (event.type !== "checkout.session.completed") {
//     return new Response("ignored", { status: 200 });
//   }

//   const session = event.data.object;

//   if (session.payment_status !== "paid") {
//     return new Response("ignored: not paid", { status: 200 });
//   }

//   // console.log("[webhook] session.id:", session.id);
//   // console.log("[webhook] payment_status:", session.payment_status);
//   // console.log("[webhook] metadata:", session.metadata);

//   // // paid 以外は予約確定しない
//   // if (session.payment_status !== "paid") {
//   //   console.log("[webhook] ignored: payment_status is not paid");
//   //   return new Response("ignored: not paid", { status: 200 });
//   // }

//   const md = session.metadata || {};

//   const experienceSlug = md.experienceSlug || "";
//   const bookingDateISO = md.bookingDateISO || "";
//   const guests = Number(md.guests || 0);
//   const name = md.name || "";
//   const email = md.email || "";

//   // 必須メタデータが無いなら確定しない（200で返す）
//   if (
//     !experienceSlug ||
//     !bookingDateISO ||
//     !email ||
//     !Number.isFinite(guests) ||
//     guests < 1
//   ) {
//     console.error("[webhook] missing metadata fields:", {
//       experienceSlug,
//       bookingDateISO,
//       guests,
//       email,
//     });
//     return new Response("Missing metadata", { status: 200 });
//   }

//   // Supabase 保存用 Date(UTC 00:00)
//   const bookingDate = new Date(`${bookingDateISO}T00:00:00Z`);
//   // バリデーション
//   if (Number.isNaN(bookingDate.getTime())) {
//     console.error("[webhook] invalid bookingDateISO:", bookingDateISO);
//     return new Response("Invalid bookingDateISO", { status: 200 });
//   }

//   let inserted = false;

//   try {
//     const res = await saveBooking({
//       stripeSessionId: session.id,
//       experienceSlug,
//       bookingDate,
//       guests,
//       name,
//       email,
//     });

//     inserted = Boolean(res?.inserted);
//     console.log("[webhook] saveBooking result:", res);
//   } catch (error) {
//     const msg = String(error?.message || error);

//     // ✅ ここが重要：duplicate は「想定内」なので 200 で返して終わる
//     if (msg.includes("bookings_unique")) {
//       console.log(
//         "[webhook] DUPLICATE by bookings_unique -> OK ignore (no email)"
//       );
//       return new Response("duplicate ignored", { status: 200 });
//     }

//     if (msg.includes("bookings_stripe_session_id_unique")) {
//       console.log(
//         "[webhook] DUPLICATE by stripe_session_id -> OK ignore (no email)"
//       );
//       return new Response("duplicate ignored", { status: 200 });
//     }

//     // それ以外は本当のエラー
//     console.error("[webhook] saveBooking failed (unexpected):", msg);
//     return new Response(msg, { status: 500 });
//   }  

//   // const { inserted } = await saveBooking({
//   //   stripeSessionId: session.id,
//   //   experienceSlug,
//   //   bookingDate,
//   //   guests,
//   //   name,
//   //   email,
//   // });

//   // // stripeSessionId を渡す
//   // let inserted;
//   // try {
//   //   const res = await saveBooking({
//   //     stripeSessionId: session.id,
//   //     experienceSlug,
//   //     bookingDate,
//   //     guests,
//   //     name,
//   //     email,
//   //   });
//   //   inserted = res.inserted;
//   //   console.log("[webhook] saveBooking:", res);
//   // } catch (error) {
//   //   console.error("[webhook] saveBooking failed:", error);
//   //   return new Response(String(error?.message || error), { status: 500 });
//   // }

//   if (inserted) {
//     try {
//       const exp = getExperienceBySlug(experienceSlug);
//       const scheduleText = buildScheduleText(exp);
//       const bookingDateText = formatBookingDateText(bookingDateISO);

//       await sendBookingEmail({
//         to: email,
//         name,
//         guests,
//         experienceTitle: exp.title,
//         scheduleText,
//         bookingDateText,
//       });

//       console.log("[webhook] sent email ✅");
//     } catch (error) {
//       console.error("[webhook] sendBookingEmail failed:", error);
//       return new Response(String(error?.message || error), { status: 500 });
//     }
//   } else {
//     console.log("[webhook] skip email (already saved)");
//   }

//   // // 1) DB保存
//   // try {
//   //   // 予約を確定（＝ DB insert）
//   //   await saveBooking({
//   //     experienceSlug,
//   //     bookingDate,
//   //     guests,
//   //     name,
//   //     email,
//   //   });
//   //   console.log("[webhook] saved booking ✅");
//   // } catch (error) {
//   //   console.error("[webhook] saveBooking failed ❌:", error);
//   //   // いまはデバッグ優先で 500 にして、stripe listen 側でも失敗が見えるようにする
//   //   // webhook は再送されるので、ここで 500 にすると何度も再送される。
//   //   // 既存の unique 制約で “二重挿入” は落ちる前提なので、200 で飲み込むのが安全。
//   //   return new Response(
//   //     `saveBooking failed: ${String(error?.message || error)}`,
//   //     { status: 500 }
//   //   );
//   // }

//   // // 2) メール送信
//   // try {
//   //   // メール送信（ここで1回だけ）
//   //   const exp = getExperienceBySlug(experienceSlug);
//   //   const scheduleText = buildScheduleText(exp);
//   //   const bookingDateText = formatBookingDateText(bookingDateISO);

//   //   await sendBookingEmail({
//   //     to: email,
//   //     name,
//   //     guests,
//   //     experienceTitle: exp.title,
//   //     scheduleText,
//   //     bookingDateText,
//   //   });

//   //   console.log("[webhook] sent email ✅");
//   // } catch (error) {
//   //   console.error("[webhook] sendBookingEmail failed ❌:", error);
//   //   return new Response(
//   //     `sendBookingEmail failed: ${String(error?.message || error)}`,
//   //     { status: 500 }
//   //   );
//   // }

//   return new Response("ok", { status: 200 });
// }