// @/app/review/page.jsx

import { verifyReviewToken } from "@/lib/server/reviewsTokens";
import ReviewForm from "./ReviewForm";

export default async function ReviewPage({ searchPrams }) {
  const params = await searchPrams;
  const token = String(params?.token || "");

  const verifyRow = await verifyReviewToken(token);

  if (!token) {
    return (
      <div className="container">
        <h1>Review</h1>
        <p>Missing token.</p>
      </div>
    );
  }

  if (!verifyRow.ok) {
    return (
      <div className="container">
        <h1>Review</h1>
        <p style={{ color: "red" }}>{verifyRow.error}</p>
      </div>
    );
  }

  const { booking } = verifyRow;

  return (
    <div className="container">
      <p className="spec">
        Experience: <striong>{booking.booking_date}</striong>
      </p>

      <ReviewForm token={token} />
    </div>
  );
}