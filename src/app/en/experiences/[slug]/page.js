// @/app/en/experiences/[slug]/page.js

import Link from "next/link";
import { notFound } from "next/navigation";
import { experiences } from "../_data/experiences";
import { reviews } from "../_data/reviews";
import BookingCard from "../_components/BookingCard";
import ReviewList from "../_components/ReviewList";
import ExperienceSlider from "../_components/ExperienceSlider";
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
        {/* HERO */}
        <section className={styles.detailHero}>
          <div className={styles.detailHeroText}>
            <p className={styles.kicker}>Awai Studio Experience</p>
            <h1>{experience.title}</h1>
            <p className={styles.shortDescription}>
              {experience.shortDescription}
            </p>
          </div>

          {/* <div className={styles.heroBooking}>
            <BookingCard experience={experience} />
          </div> */}
        </section>

        {/* GALLERY*/}
        <section className={styles.gallerySection}>
          <ExperienceSlider images={experience.galleryImages} />
        </section>

        <div className={styles.detailLayout}>
          {/* Main Contents */}
          <div className={styles.detailMain}>
            {/* Highlights */}
            {experience.highlights.length > 0 && (
              <section className={styles.detailSection}>
                <h2>Highlights</h2>
                <ul>
                  {experience.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Full Description */}
            {experience.fullDescription.length > 0 && (
              <section className={styles.detailSection}>
                <h2>Full Description</h2>
                {experience.fullDescription.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            )}

            {/* MID CTA */}
            <section className={styles.inlineCta}>
              <p>Interested in this experience?</p>
              <Link
                className="btn btn--regular"
                href={`${experience.bookingHref}`}
              >
                Check Availability
              </Link>
            </section>

            {/* What's Included */}
            {experience.included.length > 0 && (
              <section className={styles.detailSection}>
                <h2>What's Included</h2>
                <ul>
                  {experience.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Meeting Point */}
            {experience.meetingPoint.length > 0 && (
              <section className={styles.detailSection}>
                <h2>Meeting Point</h2>
                <p>{experience.meetingPoint.description}</p>
                <ul>
                  {experience.meetingPoint.access.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Important Information */}
            <section className={styles.detailSection}>
              <h2>Important Information</h2>
              <ul>
                {experience.importantInformation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Cancellation Policy */}
            <section className={styles.detailSection}>
              <h2>Cancellation Policy</h2>
              <p>{experience.cancellation.text}</p>
            </section>

            {/* Not Allowed */}
            <section className={styles.detailSection}>
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

// SEO対策
// ページ遷移ごとにtitleとdescriptionが切り替わる。
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const experience = experiences.find((item) => {
    return item.slug === slug;
  });

  if (!experience) {
    return {};
  }
  return {
    title: experience.seo.title,
    description: experience.seo.description,
  }
}

// ビルド時にページがどれくらいあるかをNext.jsに知らせる。
export function generateStaticParams() {
  return experiences.map((experience) => ({
    slug: experience.slug
  }));
}