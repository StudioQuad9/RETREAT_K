// @/lib/data/experience.js

export const EXPERIENCES = [
  {
    slug: "sokan-zen-tea",
    title: "Sokan Zen Meditation & Tea",
    durationMinutes: 90,
    priceJPY: 16000,
    scheduleDetails: [{ weekday: "THU", time: "10:00" }],
    minGuests: 3,
    capacity: 6,
    locationText: "Kyoto (details after booking)",
    highlights: [
      "Guided Zen meditation with a Zen monk",
      "Tea time in a auite temple setting",
      "Small group experience",
    ],
  },
  {
    slug: "daihoonji-kyogen",
    title: "Kyogen Exprience at DAIHOON-JI",
    durationMinutes: 180,
    priceJPY: 40000,
    scheduleDetails: [{ weekday: "SAT", time: "15:00" }],
    minGuests: 3,
    capacity: 6,
    locationText: "DAIHOON-JI, Kyoto",
    highlights: [
      "Rare cultural program held on limited dates",
      "Learn and experience Kyogen in a histric setting",
      "Premium small-group format",
    ],
  },
];

export function getExperienceBySlug(slug) {
  return EXPERIENCES.find((experience) => experience.slug === slug) || null;
}
