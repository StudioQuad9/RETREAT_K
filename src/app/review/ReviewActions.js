// @/app/review/reviewActions.js

"use server";

import { submitReviewWithToken } from "@/lib/server/reviewsTokens";

export async function submitReviewAction(_prev, formData) {
  const token = String(formData.get("token") || "");
  const rating = Number(formData.get("rating") || 0);
  const comment = String(formData.get("comment") || "");
  const displayName = String(formData.get("displayName") || "");
  const country = String(formData.get("country") || "");

  const res = await submitReviewWithToken({
    token,
    rating,
    comment,
    displayName,
    country,
  });

  if (!res.ok) return { ok: false, error: res.error, warning: ""};
  return { ok: true, error: "", warning: res.warning || ""};
}
