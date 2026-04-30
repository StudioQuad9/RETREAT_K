// @/app/en/experiences/page.js

import Link from "next/link";

export default function Experiences() {
  return (
    <div className="container">
      {/* HERO */}
      <section className="experiences-hero">
        <h1>Experiences</h1>
        <p>
          Cultural experiences in Kyoto for small groups, shaped through
          practice, dialogue, and reflection.
        </p>
      </section>

      {/* LIST */}
      <section className="experiences-list">
        {/* Tea Experience */}
        <Link href="#">
        {/* <Link href="/en/experiences/TeaExperienceWithSoKo"> */}
          <h2>Beyond Performance — A Private Tea Gathering with a Kyoto Practitioner</h2>
          <p>
            A quiet, small-group experience with a Kyoto practitioner, centered on
            making tea, real charcoal, and thoughtful conversation.
          </p>
          <p>120 minutes / up to 5 guests</p>
        </Link>

        <Link href="#">
        {/* <Link href="/en/experiences/ZenExperienceWithJirai"> */}
          <h2>Zen Experience with Jirai</h2>
          <p>
            A Zen-centered experience in Kyoto, where you explore
            your experience of Japan through dialogue with a Zen monk.
          </p>
          <p>90 minutes / up to 6 guests</p>
        </Link>
      </section>
    </div>
  );
}