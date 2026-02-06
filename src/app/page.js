// @/app/page.js

import Link from "next/link";

export default function Home() {
  return (
    <div className="container home">
      <section className="hero">
        <div className="hero__inner">
          <p className="hero__eyebrow">Japanese Cultural Experiences</p>

          <h1 className="hero__title">RETREAT K</h1>

          <p className="hero__lead">
            RETREAT K offers quiet, carefully curated cultural experiences,
            shared with guests who seek something genuine.
          </p>

          <div className="next-action">
            <Link className="btn btn--primary" href="/experiences">
              View Experiences
            </Link>
          </div>

          <p className="hero__fineprint">
            Operated in English. Designed for small groups and respectful
            settings.
          </p>
        </div>
      </section>

      <section className="featured" aria-labelledby="principles-title">
        <div className="featured__inner">
          <h2 id="principles-title" className="featured__title">
            How we operate
          </h2>

          <div className="cards">
            <article className="card">
              <h3 className="card__title">Carefully designed operation</h3>
              <p className="card__text">
                Created for guests who want to understand Japanese culture
                deeply — with small-group, thoughtful pacing.
              </p>
            </article>

            <article className="card">
              <h3 className="card__title">No overbooking by design</h3>
              <p className="card__text">
                Availability is checked before payment, and booking is confirmed
                after payment.
              </p>
            </article>

            <article className="card">
              <h3 className="card__title">Privacy-respecting venues</h3>
              <p className="card__text">
                Some experiences take place in locations where privacy is
                carefully protected.
              </p>
            </article>

            <article className="card">
              <h3 className="card__title">Clear communication</h3>
              <p className="card__text">
                Key policies are shown upfront, so you rarely need to contact
                us.
              </p>
            </article>

            <article className="card">
              <h3 className="card__title">Participation</h3>
              <p className="card__text">
                This experience is conducted in English (including guidance and
                explanations). Please join only if you can follow in English.
              </p>
            </article>
          </div>

          <div className="featured__cta">
            <Link className="btn btn--ghost" href="/experiences">
              See details and availability
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}