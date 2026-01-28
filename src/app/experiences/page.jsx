// src/app/experiences/page.jsx
import Link from "next/link";
import Image from "next/image";
import { EXPERIENCES } from "@/lib/data/experiences";
import { formatDuration } from "@/lib/utils/formatDuration";
import { formatYen } from "@/lib/utils/formatYen";
import { buildScheduleText } from "@/lib/utils/buildSchedule";

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
    <main className="experiences">
      <header className="experiences__header">
        <p className="experiences__eyebrow">Experiences</p>
        <h1 className="experiences__title">Choose an experience</h1>
        <p className="experiences__lead">
          Small-group cultural programs in Kyoto, designed for guests who want
          something genuine.
        </p>
      </header>

      <section className="experiences__grid" aria-label="Experience list">
        {EXPERIENCES.map((exp) => (
          <article key={exp.slug} className="experienceCard">
            <Link
              className="experienceCard__media"
              href={`/experiences/${exp.slug}`}
            >
              <Image
                src={getCoverSrc(exp)}
                alt={exp.title}
                width={1200}
                height={600}
                priority={exp.slug === "sokan-zen-tea"}
              />
            </Link>

            <div className="experienceCard__body">
              <h2 className="experienceCard__title">
                <Link href={`/experiences/${exp.slug}`}>{exp.title}</Link>
              </h2>

              <p className="experienceCard__tagline">{getTagline(exp)}</p>

              <dl className="experienceCard__specs">
                <div className="experienceCard__spec">
                  <dt>Schedule</dt>
                  <dd>{buildScheduleText(exp)}</dd>
                </div>
                <div className="experienceCard__spec">
                  <dt>Duration</dt>
                  <dd>{formatDuration(exp.durationMinutes)}</dd>
                </div>
                <div className="experienceCard__spec">
                  <dt>Price</dt>
                  <dd>¥{formatYen(exp.priceJPY)} / person</dd>
                </div>
                <div className="experienceCard__spec">
                  <dt>Capacity</dt>
                  <dd>Up to {exp.capacity} guests</dd>
                </div>
              </dl>

              <div className="next-actions">
                <Link
                  className="btn btn--ghost"
                  href={`/experiences/${exp.slug}`}
                >
                  View details
                </Link>

                <Link
                  className="btn btn--primary"
                  href={`/booking?experience=${exp.slug}`}
                >
                  Check availability
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

// // @/app/experiences/page.jsx

// import Link from "next/link";
// import { EXPERIENCES } from "@/lib/data/experiences";
// import { formatDuration } from "@/lib/utils/formatDuration";
// import { formatYen } from "@/lib/utils/formatYen";
// export default function ExperiencesPage() {
//   return (
//     <main>
//       <h1>Expriences</h1>
//       <ul>
//         {EXPERIENCES.map((experience) => (
//           <li key={experience.slug}>
//             <h2>{experience.title}</h2>
//             <div className="duration">
//               Duration: {formatDuration(experience.durationMinutes)}
//             </div>
//             <div className="price">
//               Price: ￥{formatYen(experience.priceJPY)}
//             </div>
//             <Link href={`/experiences/${experience.slug}`}>View details</Link>
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }