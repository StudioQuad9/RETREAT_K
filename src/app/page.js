// @/app/page.js

// @/app/page.js

import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      {/* HERO */}
      <section className="hero container">
        <header className="hero__header">
          <p className="hero__eyebrow">Kyoto · Cultural Experiences</p>

          <h1 className="hero__title">RETREAT K</h1>

          <p className="hero__lead">
            RETREAT K offers quiet, carefully curated cultural experiences,
            <br />
            shared with guests who seek something genuine.
          </p>

          <div className="hero__actions">
            <Link className="btn btn--primary" href="/experiences">
              Explore experiences
            </Link>

            <Link className="btn btn--ghost" href="/experiences/sokan-zen-tea">
              View Sokan Zen & Tea
            </Link>
          </div>
        </header>

        {/* すぐ下に「要点」だけ置く（問い合わせを減らす） */}
        <div className="hero__points">
          <div className="point">
            <div className="point__title">Small-group</div>
            <div className="point__text">Limited seats, calm pace</div>
          </div>
          <div className="point">
            <div className="point__title">Privacy-first</div>
            <div className="point__text">No personal photography</div>
          </div>
          <div className="point">
            <div className="point__title">Floor seating</div>
            <div className="point__text">Chairs are not available</div>
          </div>
          <div className="point">
            <div className="point__title">Cancellation</div>
            <div className="point__text">Free up to 24 hours before</div>
          </div>
        </div>
      </section>

      {/* FEATURED（1体験だけ） */}
      <section className="section container">
        <header className="section__header">
          <h2 className="section__title">Featured experience</h2>
          <p className="section__sub">
            One experience, carefully prepared. No marketplace noise.
          </p>
        </header>

        <article className="card">
          <div className="card__body">
            <div className="card__badge">Zen & Tea</div>
            <h3 className="card__title">Sokan Zen Meditation & Tea</h3>
            <p className="card__text">
              Guided by a Zen monk at a secluded temple in northern Kyoto (Yase).
              A quiet session designed to preserve stillness.
            </p>

            <div className="card__actions">
              <Link className="btn btn--primary" href="/experiences/sokan-zen-tea">
                View details
              </Link>
              <Link className="btn btn--ghost" href="/booking?experience=sokan-zen-tea">
                Book
              </Link>
            </div>
          </div>
        </article>
      </section>

      {/* HOW IT WORKS（短く） */}
      <section className="section container">
        <header className="section__header">
          <h2 className="section__title">How it works</h2>
        </header>

        <ol className="steps">
          <li className="steps__item">
            <div className="steps__title">1) Choose a date</div>
            <div className="steps__text">Available dates are shown on the booking calendar.</div>
          </li>
          <li className="steps__item">
            <div className="steps__title">2) Pay securely</div>
            <div className="steps__text">Payment is handled by Stripe Checkout.</div>
          </li>
          <li className="steps__item">
            <div className="steps__title">3) Confirmation email</div>
            <div className="steps__text">You will receive a confirmation email after payment.</div>
          </li>
        </ol>
      </section>

      {/* FOOTER NOTE（問い合わせを減らす） */}
      <section className="section container">
        <div className="note">
          <h2 className="note__title">Contact</h2>
          <p className="note__text">
            For same-day contact, please use email. Details will be provided after booking.
          </p>
        </div>
      </section>
    </main>
  );
}




// import Image from "next/image";
// import styles from "./page.module.scss";

// export default function Home() {
//   return (
//     <>
//       <h1>RETREAT K</h1>
//       <p>トップページが表示されています。</p>
//       <div className="container">
//         {/* 本文が入る */}
//       </div>
//     </>
//   );
// }
