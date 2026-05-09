// @/app/en/experiences/page.js

import Link from "next/link";
import { experiences } from "./_data/experiences";
import { getGuestText } from "@/lib/formatExperiences";
import styles from "./experiences.module.scss";

export default function Experiences() {
  return (
    <div className="container">
      {/* HERO */}
      <section className={styles.experiencesHero}>
        <h1>Experiences</h1>
        <p>
          Cultural experiences in Kyoto for small groups, shaped through
          practice, dialogue, and reflection.
        </p>
      </section>

      {/* LIST */}
      <section className={styles.experiencesList}>
        {/* Tea Experience */}
        {experiences.map((experience) => (
          <Link
            key={experience.slug}
            // Next.jsは、このURLの『experience.slug』を
            // ExperienceDetailPage({ params })の『params』に渡す。
            // AppRouterが自動で判断してやっている。
            href={`/en/experiences/${experience.slug}`}
          >
            <h2>{experience.cardTitle}</h2>
            <p>{experience.cardShortDescription}</p>
            <p>
              {experience.duration.minutes} minutes /{" "}
              {getGuestText(experience.pricing)}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}