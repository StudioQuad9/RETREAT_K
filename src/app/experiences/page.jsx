import Link from "next/link";
import { EXPRIENCES } from "@/lib/data/expriences";

export default function ExpriencesPage() {
  return (
    <main>
      <h1>Expriences</h1>
      <ul>
        {EXPRIENCES.map((exprience) => (
          <li key={exprience.slug}>
            <h2>{exprience.title}</h2>
            <div className="duration">
              Duration: {Math.round(exprience.durationMinutes / 30) / 2} hours
            </div>
            <div className="price">￥{exprience.priceJPY.toLocaleString()}</div>
            <Link href={`/exprience/${exprience.slug}`}>View details</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}