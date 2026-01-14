// src/app/admin/bookings/page.jsx
import "server-only";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import styles from "./page.module.scss";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ 簡易ガード（ローカル運用想定）
// .env.local に ADMIN_TOKEN=任意の長い文字列 を入れて、
// /admin/bookings?token=その文字列 で開けるようにする
function requireAdmin(params) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) return; // 未設定ならガード無し（ローカルだけならOK）

  const token = String(params?.token || "");
  if (token !== adminToken) redirect("/");
}

function formatDateTimeJST(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

function tokenQS(params) {
  const t = String(params?.token || "");
  return t ? `&token=${encodeURIComponent(t)}` : "";
}

export default async function AdminBookingsPage({ searchParams }) {
  // ✅ Next.jsの挙動差を吸収：PromiseでもObjectでもOK
  const params = await searchParams;

  requireAdmin(params);

  const limitRaw = Number(params?.limit || 50);
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(limitRaw, 1), 200)
    : 50;

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select(
      [
        "id",
        "created_at",
        "experience_slug",
        "booking_date",
        "guests",
        "name",
        "email",
        "stripe_session_id",
      ].join(",")
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Bookings</h1>
          <p className={styles.sub}>
            Latest <b>{limit}</b> rows (JST)
          </p>
        </div>

        <div className={styles.actions}>
          <a
            className={styles.link}
            href={`/admin/bookings?limit=50${tokenQS(params)}`}
          >
            limit=50
          </a>
          <a
            className={styles.link}
            href={`/admin/bookings?limit=100${tokenQS(params)}`}
          >
            limit=100
          </a>
          <a
            className={styles.link}
            href={`/admin/bookings?limit=200${tokenQS(params)}`}
          >
            limit=200
          </a>
        </div>
      </header>

      {error && (
        <div className={styles.errorBox}>
          <div className={styles.errorTitle}>Failed to load bookings</div>
          <div className={styles.mono}>{error.message}</div>
        </div>
      )}

      {!error && (!data || data.length === 0) && (
        <div className={styles.empty}>No bookings yet.</div>
      )}

      {!error && Array.isArray(data) && data.length > 0 && (
        <section className={styles.grid}>
          {data.map((row) => (
            <article key={row.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.badge}>{row.experience_slug || "-"}</div>
                <div className={styles.createdAt}>
                  {formatDateTimeJST(row.created_at)}
                </div>
              </div>

              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Booking date</div>
                  <div className={styles.metaValue}>
                    {row.booking_date || "-"}
                  </div>
                </div>

                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Guests</div>
                  <div className={styles.metaValue}>{row.guests ?? "-"}</div>
                </div>

                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Email</div>
                  <div className={styles.metaValue}>{row.email || "-"}</div>
                </div>

                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Name</div>
                  <div className={styles.metaValue}>{row.name || "-"}</div>
                </div>
              </div>

              <div className={styles.kv}>
                <div className={styles.kvLabel}>stripe_session_id</div>
                <div
                  className={styles.monoEllipsis}
                  title={row.stripe_session_id || ""}
                >
                  {row.stripe_session_id || "-"}
                </div>
              </div>

              <div className={styles.kv}>
                <div className={styles.kvLabel}>id</div>
                <div className={styles.monoEllipsis} title={row.id}>
                  {row.id}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <footer className={styles.footer}>
        <div className={styles.help}>
          <div className={styles.helpTitle}>Tips</div>
          <ul className={styles.helpList}>
            <li>
              件数: <span className={styles.mono}>?limit=100</span>
            </li>
            <li>
              ガード: <span className={styles.mono}>ADMIN_TOKEN</span>{" "}
              を使うなら <span className={styles.mono}>?token=xxxxx</span>
            </li>
          </ul>
        </div>
      </footer>
    </main>
  );
}
