import Link from "next/link";

export default function ReviewThaksPage() {
  return (
    <div className="container">
      <h1>Thank you</h1>
      <p className="spec">Your review has been submitted.</p>
      <p className="spec">You may close this tab.</p>
      <Link className="btn btn--ghost" href="/experiences">
        Back to experiences
      </Link>
    </div>
  );
}