// @/lib/server/sendBookingEmail.js

import "server-only";
import { Resend } from "resend";

// .env.localに設定した値を取ってくる。
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingEmail({
  to,
  name,
  guests,
  experienceTitle,
  scheduleText,
  bookingDateText,
}) {
  if (!to) throw new Error("Missing recpient email (to)");
  if (!process.env.RESEND_FROM) throw new Error("Missing RESEND_FROM");
  if (!process.env.ADMIN_EMAIL) throw new Error("Missing ADMIN_EMAIL");

  const safeName = name || "Guest";
  const safeGuests = guests || "-";
  const safeTitle = experienceTitle || "RETREAT K";
  const safeSchedule = scheduleText || "-";

  // for Customer email
  const customSubject = `Booking confirmed: ${safeTitle}`;
  const customerText = `
Thank you for your booking!

Experience: ${safeTitle}
Schedule: ${safeSchedule}
Booking Date: ${bookingDateText || "-"}
Guests: ${safeGuests}
Name: ${safeName}

After your experience, we will send you a short review request.
Your feedback helps us preserve authentic cultural programs.
  `.trim();

  // for Admin email
  const adiminSubject = `New booking: ${safeTitle} (${safeGuests} guests)`;
  const adiminText = `
新しい体験予約が届きました。

Experience: ${safeTitle}
Schedule: ${safeSchedule}
Booking Date: ${bookingDateText || "-"}
Guests: ${safeGuests}
Name: ${safeName}
Customer email: ${to}
  `.trim();

  // 客と自身にメールを送信する
  const [customerResult, adminResult] = await Promise.all([
    resend.emails.send({
      from: process.env.RESEND_FROM,
      to,
      subject: customSubject,
      text: customerText,
    }),
    resend.emails.send({
      from: process.env.RESEND_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: adiminSubject,
      text: adiminText
    }),
  ]);

  if (customerResult.error) {
    throw new Error(JSON.stringify(customerResult.error));
  }
  if (adminResult.error) {
    throw new Error(JSON.stringify(adminResult.error));
  }
}

// // mailが通ったか最低限のテストのコード
// import "server-only";
// import { Resend } from "resend";

// // .env.localに設定した値を取ってくる。
// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendBookingEmail({
//   to,
//   name,
//   guests,
//   experienceTitle,
//   scheduleText,
// }) {
//   if (!to) throw new Error("Missing recpient email (to)");

//   const subject = `Booking confirmed: ${experienceTitle}`;

//   const text = `
// Thank you for your booking!

// Experience: ${experienceTitle}
// Schedule: ${scheduleText}
// Guests: ${guests}
// Name: ${name}

// After your experience, we will send you a short review request.
// Your feedback helps us preserve authentic cultural programs.
//   `;

//   // await resend.emails.send()メソッドで返ってくる値が、『data』と『error』だから。
//   // ただし、この際は不要。
//   //   {
//   //     data: {
//   //       id: "email_xxxxx",
//   //       from: "...",
//   //       to: "...",
//   //       created_at: "..."
//   //     },
//   //     error: null
//   //   }
//   const { error } = await resend.emails.send({
//     from: process.env.RESEND_FROM,
//     to,
//     subject,
//     text,
//   });

//   if (error) {
//     throw new Error(JSON.stringify(error));
//   }
// }