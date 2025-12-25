// @/app/experiences/page.jsx

import Link from "next/link";
import { EXPERIENCES } from "@/lib/data/experiences";
import { formatDuration } from "@/lib/utils/formatDuration";
import { formatYen } from "@/lib/utils/formatYen";
export default function ExperiencesPage() {
  return (
    <main>
      <h1>Expriences</h1>
      <ul>
        {EXPERIENCES.map((experience) => (
          <li key={experience.slug}>
            <h2>{experience.title}</h2>
            <div className="duration">
              Duration: {formatDuration(experience.durationMinutes)}
            </div>
            <div className="price">
              Price: ￥{formatYen(experience.priceJPY)}
            </div>
            <Link href={`/experiences/${experience.slug}`}>View details</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
