// @/app/review/page.jsx

import { verifyReviewToken } from "@/lib/server/reviewTokens";
import ReviewForm from "./ReviewForm";

export default async function ReviewPage({ searchParams }) {
  const params = await searchParams;
  const token = String(params?.token || "");

  const verifiedToken = await verifyReviewToken(token);

  if (!token) {
    return (
      <div className="container">
        <h1>Review</h1>
        <p>Missing token.</p>
      </div>
    );
  }

  if (!verifiedToken.ok) {
    return (
      <div className="container">
        <h1>Review</h1>
        <p style={{ color: "red" }}>{verifiedToken.error}</p>
      </div>
    );
  }

  const { booking } = verifiedToken;

  return (
    <div className="container">
      <h1>Leave a review</h1>
      <p className="spec">
        Experience: <strong>{booking.experience_slug}</strong>
        <br />
        Date: <strong>{booking.booking_date}</strong>
      </p>

      <ReviewForm token={token} />
    </div>
  );
}