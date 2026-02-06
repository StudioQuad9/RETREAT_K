// src/app/experiences/page.jsx
import Link from "next/link";
import Image from "next/image";
import { EXPERIENCES } from "@/lib/data/experiences";
import { formatDuration } from "@/lib/utils/formatDuration";
import { formatYen } from "@/lib/utils/formatYen";
import { buildScheduleText } from "@/lib/utils/buildSchedule";
import styles from "./page.module.scss";

function getCoverSrc(exp) {
  // ✅ まずは仮：/public/experiences/{slug}.jpg を置けば表示される
  // 例) public/experiences/sokan-zen-tea.jpg
  return `/experiences/${exp.slug}.jpg`;
}

function getTagline(exp) {
  // ✅ とりあえず仮：あとで experiences.js に exp.tagline を足すのが理想
  if (exp.slug === "sokan-zen-tea") {
    return "A quiet Zen and tea session at a secluded temple in northern Kyoto.";
  }
  if (exp.slug === "daihoonji-kyogen") {
    return "A rare Kyogen experience inside a living temple setting.";
  }
  return "A carefully curated cultural experience in Kyoto.";
}

export default function ExperiencesPage() {
  return (
    <div className={`container ${styles.experiences}`}>
      <header className={styles.experiences__header}>
        <p className={styles.experiences__eyebrow}>Experiences</p>
        <h1 className={styles.experiences__title}>Choose an experience</h1>
        <p className={styles.experiences__lead}>
          Small-group cultural programs in Kyoto, designed for guests who want
          something genuine.
        </p>
      </header>

      <section
        className={styles.experiences__grid}
        aria-label="Experience list"
      >
        {EXPERIENCES.map((exp) => (
          <article key={exp.slug} className={styles.experienceCard}>
            <Link
              className={styles.experienceCard__media}
              href={`/experiences/${exp.slug}`}
            >
              <div className={`image-wrapper ${styles.experienceCard__media}`}>
                <Image
                  src={getCoverSrc(exp)}
                  alt={exp.title}
                  fill
                  sizes="100vw"
                  priority={exp.slug === "sokan-zen-tea"}
                />
              </div>
            </Link>

            <div className={styles.experienceCard__body}>
              <h2 className={styles.experienceCard__title}>
                <Link href={`/experiences/${exp.slug}`}>{exp.title}</Link>
              </h2>

              <p className={styles.experienceCard__tagline}>
                {getTagline(exp)}
              </p>

              <dl className="spec-wrapper">
                <div className="spec">
                  <dt>Schedule</dt>
                  <dd>{buildScheduleText(exp)}</dd>
                </div>
                <div className="spec">
                  <dt>Duration</dt>
                  <dd>{formatDuration(exp.durationMinutes)}</dd>
                </div>
                <div className="spec">
                  <dt>Price</dt>
                  <dd>¥{formatYen(exp.priceJPY)} / person</dd>
                </div>
                <div className="spec">
                  <dt>Capacity</dt>
                  <dd>Up to {exp.capacity} guests</dd>
                </div>
              </dl>

              <div className="next-action">
                <Link
                  className="btn btn--ghost"
                  href={`/experiences/${exp.slug}`}
                  aria-label={`View details: ${exp.title}`}
                >
                  View details
                </Link>

                <Link
                  className="btn btn--primary"
                  href={`/booking?experience=${exp.slug}`}
                  aria-label={`Check availability: ${exp.title}`}
                >
                  Check availability
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}