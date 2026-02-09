// @/app/review/ReviewActions.js

"use server";

// アプリ側のフォームから送られるデータをサーバーに中継するためのインターチェンジ。

import { submitReviewWithToken } from "@/lib/server/reviewTokens";
import { redirect } from "next/navigation";

// ここでやりたいことは、
// フォームからのデータを引数にとってsubmitReviewWithToken関数を呼び出すこと。
// 呼び出したら、reviewTokensの中のsubmitReviewWithToken関数が実行されて、
// サーバーにデータが格納されるという寸法。

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

  redirect("/review/thanks");
  // return { ok: true, error: "", warning: res.warning || ""};
}
