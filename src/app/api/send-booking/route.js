import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, experienceTitle, scheduleText, guests } = body;

    if (!to) {
      return NextResponse.json({ ok: false, error: "Missing 'to' email" }, { status: 400 });
    }

    const subject = `Booking confirmed: ${ experienceTitle ?? "RETREAT K"}`;

    const text = [
      "Your booking is confirmed.",
      "",
      `Experience: ${ experienceTitle ?? "-" }`,
      `Suchedule: ${ scheduleText ?? "-" }`,
      guests ? `Guests: ${ guests }` : null,
      "",
      "After your experiecne, we will send you a short review request.",
    ].filter(Boolean).join("\n");

    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Unkown error"},
      { status: 500 }
    );
  } 
}