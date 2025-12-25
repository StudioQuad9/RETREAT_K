import "server-only";
import { Resend } from "resend";

// .env.localに設定した値を取ってくる。
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingEmail({ to, name, guests, experienceTitle, scheduleText }) {
  if (!to) throw new Error("Missing recpient email (to)");

  const subject = `Booking confirmed: ${experienceTitle}`;

  const text = `
Thank you for your booking!

Experience: ${experienceTitle}
Schedule: ${scheduleText}
Guests: ${guests}
Name: ${name}

After your experience, we will send you a short review request.
Your feedback helps us preserve authentic cultural programs.
  `;

  // await resend.emails.send()メソッドで返ってくる値が、『data』と『error』だから。
  // ただし、この際は不要。
  //   {
  //     data: {
  //       id: "email_xxxxx",
  //       from: "...",
  //       to: "...",
  //       created_at: "..."
  //     },
  //     error: null
  //   }
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: "takahiro@kumihan.com",
    subject,
    text,
  });

  if (error) {
    throw new Error(JSON.stringify(error));
  }
}