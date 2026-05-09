// @/app/en/experiences/[slug]/page.js

import { notFound } from "next/navigation";
import { experiences } from "../_data/experiences";
import { reviews } from "../_data/reviews";
import BookingCard from "../_components/BookingCard";
import ReviewList from "../_components/ReviewList";
import styles from "../experiences.module.scss";

export default async function ExperienceDetailPage({ params }) {
  const { slug } = await params;

  const experience = experiences.find((item) => {
    return item.slug === slug;
  });

  if (!experience) notFound();

  const experienceReviews = reviews.filter((review) => {
    return review.experienceSlug === experience.slug && review.isPublished;
  });

  return (
    <div className="container detail">
      <div className={styles.experienceDetail}>
        <div className={styles.detailLayout}>
          {/* Main Contents */}
          <div className={styles.detailMain}>
            {/* Title */}
            <section className={styles.hero}>
              <h1>{experience.title}</h1>
              <p className={styles.shortDescription}>
                {experience.shortDescription}
              </p>
            </section>

            {/* Gallery */}
            <section>
              <div className={styles.galleryPlaceHolder}>Gallery Slider</div>
            </section>

            {/* Highlights */}
            <section>
              <h2>Highlights</h2>
              <ul>
                {experience.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Full Description */}
            <section>
              <h2>Full Description</h2>
              {experience.fullDescription.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            {/* What's Included */}
            <section>
              <h2>What's Included</h2>
              <ul>
                {experience.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Meeting Point */}
            <section>
              <h2>Meeting Point</h2>
              <p>{experience.meetingPoint.description}</p>
              <ul>
                {experience.meetingPoint.access.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Important Information */}
            <section>
              <h2>Important Information</h2>
              <ul>
                {experience.importantInformation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Not Allowed */}
            <section>
              <h2>Not Allowed</h2>
              <ul>
                {experience.notAllowed.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Reviews */}
            <ReviewList reviews={experienceReviews} />
          </div>

          {/* Sidebar */}
          <aside className={styles.detailSidebar}>
            <BookingCard experience={experience} />
          </aside>
        </div>
      </div>
    </div>
  );
}

// ビルド時にページがどれくらいあるかをNext.jsに知らせる。
export function generateStaticParams() {
  return experiences.map((experience) => ({
    slug: experience.slug
  }));
}