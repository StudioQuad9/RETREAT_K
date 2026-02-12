import "server-only";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const th = {
  textAlign: "left",
  padding: "10px 8px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.15)",
  whiteSpace: "nowrap",
};

const td = {
  padding: "10px 8px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
  verticalAlign: "top",
  whiteSpace: "nowrap",
};

export default async function AdminBookingsPage() {
  // キャッシュを強制的に消す。
  noStore();

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("id, created_at, experience_slug, booking_date, guests, name, email")
    .order("created_at", { ascending: false })
    .limit(200);
  
  if (error) {
    return (
      <div className="container">
        <h1>Admin: Bookings</h1>
        <p style={{ color: "red" }}>{error.message}</p>
      </div>
    );
  }

  const rows = Array.isArray(data) ? data : [];

  const bookingIds = rows.map((booking) => booking.id);

  const { data: tokenRows, error: tokenErr } = await supabaseAdmin
    .from("review_tokens")
    .select("booking_id, token, used_at, expires_at")
    .in("booking_id", bookingIds);

  const tokenByBookingId = new Map(
    (tokenRows || []).map((token) => [token.booking_id, token])
  );

  function fmtDateTime(iso) {
    if (!iso) return "";

    try {
      return new Date(iso).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    } catch {
      return String(iso);
    }
  }

  function getReviewStatus(tokenRow) {
    if (!tokenRow) return "Not Issued";
    if (tokenRow.used_at) return "Reviewed";
    return "Issued";
  }

  function statusStyle(status) {
    if (status === "Reviewed") return { color: "green", fontWeight: 700 };
    if (status === "Issued") return { color: "#b36b00", fontWeight: 700 };
    return { color: "gray", fontWeight: 600 };
  }  

  return (
    <div className="container">
      <h1>Admin: Bookings</h1>
      <p className="spec">Latest {rows.length} bookings</p>

      {rows.length === 0 ? (
        <p>No bookings</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th style={th}>created</th>
                <th style={th}>date</th>
                <th style={th}>experience</th>
                <th style={th}>name</th>
                <th style={th}>email</th>
                <th style={th}>guests</th>
                <th style={th}>status</th>
                <th style={th}>review</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((booked) => {
                const tokenRow = tokenByBookingId.get(booked.id);
                const status = getReviewStatus(tokenRow);

                return (
                  <tr key={booked.id}>
                    <td style={td}>{fmtDateTime(booked.created_at)}</td>
                    <td style={td}>{booked.booking_date || ""}</td>
                    <td style={td}>{booked.experience_slug || ""}</td>
                    <td style={td}>{booked.name || ""}</td>
                    <td style={td}>{booked.email || ""}</td>
                    <td style={td}>{booked.guests ?? ""}</td>
                    <td style={td}>
                      <span style={statusStyle(status)}>{status}</span>
                    </td>

                    <td style={td}>
                      <Link
                        className="btn btn--ghost"
                        href={`/admin/review-token?bookingId=${encodeURIComponent(booked.id)}`}
                        target="_blank"
                      >
                        {status === "Not Issued"
                          ? "Issue token"
                          : "View token"}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {
            tokenErr 
              ? (
                <p style={{ color: "red" }}>
                  Failed to load review token status: {tokenErr.message}
                </p>
                )
              : null
          }
        </div>
      )}

      <div className="next-action">
        <Link className="btn btn--ghost" href="/experiences">
          Back to site
        </Link>
      </div>
    </div>
  );
}