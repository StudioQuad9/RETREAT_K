// @/lib/data/reviews.js

export const REVIEWS = [
  {
    experienceSlug: "",
    displayName: "",
    country: "",
    rating: 5,
    comment: "",
    date: "2026-4-1",
    source: "site", // site | google
  }
];

export function getReviewByExperienceSlug(slug) {
  return REVIEWS.filter((review) => review.experienceSlug === slug);
}