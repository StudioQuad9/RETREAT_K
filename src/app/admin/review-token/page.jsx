// src/app/admin/review-token/page.jsx
import { createReviewToken } from "@/lib/server/reviewTokens";
import { getSiteURL } from "@/lib/config/site";

export default async function AdminReviewTokenPage({ searchParams }) {
  const params = await searchParams;
  const bookingId = String(params?.bookingId || "");
  const siteURL = getSiteURL();

  if (!bookingId) {
    return (
      <div className="container">
        <h1>Admin: Review Token</h1>
        <p>Use: /admin/review-token?bookingId=...</p>
      </div>
    );
  }

  const { token, expiresAt } = await createReviewToken({
    bookingId,
    daysValid: 30,
  });

  return (
    <div className="container">
      <h1>Admin: Review Token</h1>
      <p className="spec">
        bookingId: <strong>{bookingId}</strong>
      </p>
      <p className="spec">
        expiresAt: <strong>{expiresAt}</strong>
      </p>
      <p className="spec">
        Review URL:{" "}
        <strong>{`&{siteURL}/review?token=${token}`}</strong>
      </p>
    </div>
  );
}