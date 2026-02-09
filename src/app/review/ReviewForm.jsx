// @/app/review/ReviewForm.jsx

"use client";

import { useActionState } from "react";
import { submitReviewAction } from "./reviewActions";

// useActionStateの引数にサーバーとの中継になる関数を引数に持つ。
// [state, useState]の関係と同じと考えると理解できるかもしれない。
// [state, formAction, isPending]のformActionは、更新用のもの。
// 更新するための手段はフォーム。
// 識別子として、<form action={formAction}></form>と宣言している。と理解でいいのでは。

export default function ReviewForm({ token }) {
  const [state, formAction, isPending] = useActionState(submitReviewAction, {
    ok: true,
    error: "",
    warning: "",
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />

      <section>
        <h2>Rating</h2>

        <fieldset style={{ border: "none", margin: 0, paddng: 0 }}>
          <legend className="spec">Select 1 to 5</legend>
          <div style={{ display: "flex", gap: "0.6rem", margnTop: "0.5rem" }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <label
                key={num}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <input 
                  type="radio"
                  name="rating"
                  value={String(num)}
                  required
                />
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section>
        <h2>Your review</h2>
        <label htmlFor="comment">
          Comment (10+ chars)
          <textarea
            id="comment"
            name="comment"
            rows={6}
            required
            style={{ width: "100%", marginTop: 6, padding: 10 }}
          />
        </label>

        <label htmlFor="displayName">
          Display name (optional)
          <input 
            id="displayName"
            name="displayName"
            type="text" 
          />
        </label>

        <label htmlFor="country">
          Country (optional)
          <input 
            id="country"
            name="country" 
            type="text" 
            placeholder="US / UK / AU ..." />
        </label>
      </section>

      {!state.ok && state.error && <p style={{ color: "red" }}>{state.error}</p>}
      {state.ok && state.warning && <p style={{ color: "#b36b00" }}>{state.warning}</p>}
      {state.ok && !state.warning && <p className="spec">Thank you for your feedback.</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
