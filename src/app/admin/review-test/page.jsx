// @/app/admin/review-test/page.jsx

// http://localhost:3000/admin/review-test
// 参加者全員に手動で送る方法
// ページのアドレスと関数名は同じである必要はない。

import { sendReviewEmail } from "@/lib/server/sendReviewEmail";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { buildScheduleText } from "@/lib/utils/buildSchedule";

export default function ReviewTestPage() {
  async function send(formData) {
    "use server";

    const to = String(formData.get("to") || "");
    const name = String(formData.get("name" || ""));
    const experience = String(formData.get("experience") || "");

    const exp = experience ? getExperienceBySlug(experience) : null;
    const scheduleText = buildScheduleText(exp);

    await sendReviewEmail({
      to,
      name,
      experienceTitle: exp?.title ?? "",
      experienceSlug: exp?.slug ?? "",
      scheduleText,
    });
  }

  return (
    <div className="container review">
      <h1 className="en">Review Email Test</h1>
      <form action={send}>
        <label htmlFor="email">
          To (your email)
          <input id="email" name="to" type="emai" required />
        </label>

        <label htmlFor="name">
          Name
          <input id="name" name="name" type="text" />
        </label>

        <label htmlFor="experience">
          Experience slug name
          <input
            id="experience"
            name="experience"
            type="text"
            placeholder="Ex)&emsp;sokan-zen-tea"
            required
          />
        </label>

        <button type="submit">Send review email</button>
      </form>
    </div>
  );
}
