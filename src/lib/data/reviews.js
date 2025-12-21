export const REVIEWS = [
  {
    exprienceSlug: "",
    displayName: "",
    country: "",
    rating: 5,
    comment: "",
    date: "2026-4-1",
    source: "site", // site | google
  }
];

export function getReviewByExprienceSlug(slug) {
  return REVIEWS.filter((r) => r.exprienceSlug === slug);
}