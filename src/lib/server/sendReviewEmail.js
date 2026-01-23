// @/lib/server/sendReviewEmail.js

import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildReviewLink({ experienceSlug, email }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  // 例えば、
  // 文化体験が、宗貫住職の禅と茶。体験者のメールアドレスが、studio.quad9@gmail.com。
  // この情報を使ってレビューのためのリンクを作成して、レビューしてもらうページへ誘導する。
  // URLを使って検索できるパラメータを生成する。
  // そのために、URLSearchParamsのクラス関数（?）を生成して変数paramsに格納。
  // http://localhost:3000/?experience=sokan-zen-tea&email=studio.quad9%40gmail.com

  const params = new URLSearchParams();
  if (experienceSlug) params.set("experience", experienceSlug);
  if (email) params.set("email", email);

  return `${baseUrl}/?${params.toString()}`;
}

// Resendを使ってメールを送るための仕掛け
export async function sendReviewEmail({
  to,
  name,
  experienceTitle,
  experienceSlug,
  scheduleText,
}) {
  if (!to) throw new Error("Missing recipient email (to)");
  if (!process.env.RESEND_FROM) throw new Error("Missing RESEND_FROM");
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    console.warn("NEXT_PUBLIC_SITE_URL is not set. Using localhost for review link.");
  }

  const subject = `Thanks you for joining us - a quich review request`;
  const reviewLink = buildReviewLink({ experienceSlug, email: to});
  const text = `
Hi ${name || "there"},

Thank you again for joining us.

Experience: ${experienceTitle || "-"}
schedule: ${scheduleText || "-"}

Could you take 30 seconds to share your feedback?
Your review helps us preserve authentic cultural programs in Kyoto.

Review link:
${reviewLink}

Thank you,
RETREAT K
`.trim();

  // Resendを使ってメールを送る本体
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM,
    to,
    subject,
    text,
  });

  if (error) throw new Error(JSON.stringify(error));
  return data;
}