// @/lib/data/experiences.js

export const EXPERIENCES = [
  {
    slug: "sokan-zen-tea",
    title: "Sokan Zen Meditation & Tea",
    summary:
      "A quiet Zen and tea experience guided by a Zen monk at a secluded temple in northern Kyoto.",
    notice:
      "Participation: This experience is conducted in English (including guidance and explanations). Please join only if you can follow in English. Photography policy may apply depending on the venue.",

    // 画像は後で差し替えOK。今は仮パスで置いておく（/public 配下）
    // 例: /public/images/experiences/sokan-zen-tea.jpg
    heroImage: {
      src: "/experiences/sokan-zen-tea.jpg",
      alt: "A quiet moment of Zen and tea in a temple setting in northern Kyoto",
    },

    durationMinutes: 90,
    priceJPY: 16000,
    scheduleDetails: [{ weekday: "THU", time: "10:00" }],
    minGuests: 3,
    capacity: 6,
    locationText: "Kyoto (details after booking)",
    highlights: [
      "Guided Zen meditation with a Zen monk",
      "Tea time in a quiet temple setting",
      "Small group experience",
    ],
  },
  {
    slug: "daihoonji-kyogen",
    title: "Kyogen Experience at DAIHOON-JI",
    summary:
      "A premium Kyogen program held on limited dates in a historic Kyoto temple setting.",
    notice:
      "Participation: This experience is conducted in English (including guidance and explanations). Please join only if you can follow in English.",

    heroImage: {
      src: "/experiences/daihoonji-kyogen.jpg",
      alt: "Kyogen experience at a historic temple venue in Kyoto",
    },

    durationMinutes: 180,
    priceJPY: 40000,
    scheduleDetails: [{ weekday: "SAT", time: "15:00" }],
    minGuests: 3,
    capacity: 6,
    locationText: "DAIHOON-JI, Kyoto",
    highlights: [
      "Rare cultural program held on limited dates",
      "Learn and experience Kyogen in a historic setting",
      "Premium small-group format",
    ],
  },
];

export function getExperienceBySlug(slug) {
  return EXPERIENCES.find((experience) => experience.slug === slug) || null;
}

// // @/lib/data/experience.js

// export const EXPERIENCES = [
//   {
//     slug: "sokan-zen-tea",
//     title: "Sokan Zen Meditation & Tea",
//     durationMinutes: 90,
//     priceJPY: 16000,
//     scheduleDetails: [{ weekday: "THU", time: "10:00" }],
//     minGuests: 3,
//     capacity: 6,
//     locationText: "Kyoto (details after booking)",
//     highlights: [
//       "Guided Zen meditation with a Zen monk",
//       "Tea time in a auite temple setting",
//       "Small group experience",
//     ],
//   },
//   {
//     slug: "daihoonji-kyogen",
//     title: "Kyogen Exprience at DAIHOON-JI",
//     durationMinutes: 180,
//     priceJPY: 40000,
//     scheduleDetails: [{ weekday: "SAT", time: "15:00" }],
//     minGuests: 3,
//     capacity: 6,
//     locationText: "DAIHOON-JI, Kyoto",
//     highlights: [
//       "Rare cultural program held on limited dates",
//       "Learn and experience Kyogen in a histric setting",
//       "Premium small-group format",
//     ],
//   },
// ];

// export function getExperienceBySlug(slug) {
//   return EXPERIENCES.find((experience) => experience.slug === slug) || null;
// }
