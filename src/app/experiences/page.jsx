import Link from "next/link";
import { EXPERIENCES } from "@/lib/data/experiences";

export default function ExperiencesPage() {
  return (
    <main>
      <h1>Expriences</h1>
      <ul>
        {EXPERIENCES.map((experience) => (
          <li key={experience.slug}>
            <h2>{experience.title}</h2>
            <div className="duration">
              Duration: {Math.round(experience.durationMinutes / 30) / 2} hours
            </div>
            <div className="price">
              Price: ￥{experience.priceJPY.toLocaleString()}
            </div>
            <Link href={`/experience/${experience.slug}`}>View details</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}