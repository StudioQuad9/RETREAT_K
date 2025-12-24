import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingEmail({ to, name, guests, experienceTitle, scheduleText }) {

  console.log("RESEND_FROM:", process.env.RESEND_FROM);
  console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

  if (!to) throw new Error("Missing recpient email (to)");

  const subject = `Booking confirmed: ${ experienceTitle }`;

  const text = `
Thank you for your booking!

Experience: ${ experienceTitle }
Schedule: ${ scheduleText }
Guests: ${ guests }
Name: ${ name }

After your experience, we will send you a short review request.
Your feedback helps us preserve authentic cultural programs.
  `;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: "takahiro@kumihan.com",
    subject,
    text,
  }); 

  console.log("RESEND result:", { data, error });
  if (error) {
    throw new Error(JSON.stringify(error));
  }
}