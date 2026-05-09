// @/app/en/experiences/_data/experiences.js

export const experiences = [
  {
    slug: "TeaExJack",
    title: "Kyoto: Private Tea Experience with a Kyoto Practitioner",
    cardTitle:
      "Beyond Performance — A Private Tea Gathering with a Kyoto Practitioner",
    shortDescription:
      "A quiet, small-group experience with a Kyoto practitioner, centered on making tea, real charcoal, and thoughtful conversation.",
    cardShortDescription:
      "Cultural experiences in Kyoto for small groups, shaped through practice, dialogue, and reflection.",
    pricing: {
      type: "privateGroup",
      amount: 48000,
      currency: "JPY",
      displayPrice: "¥48,000",
      unit: "per private group",
      minGuests: 1,
      maxGuests: 5,
      stripePriceId: null,
    },
    duration: {
      minutes: 120,
      display: "Approximately 120 minutes",
    },
    host: {
      name: "Soko",
      role: "Kyoto-based tea practitioner",
      languages: ["English"],
    },
    cancellation: {
      summary: "Free cancellation",
      text: "Free cancellation up to 7 days before the experience. Cancellations made less than 7 days before the experience are non-refundable. Date changes may be possible depending on availability.",
    },
    highlights: [
      "Experience private tea in a quiet Kyoto tea room, away from crowded tourist areas.",
      "Make tea yourself under the guidance of a Kyoto-based practitioner rooted in the Urasenke tradition.",
      "Notice the atmosphere created by real charcoal, sound, fragrance, the glow of candles, and stillness.",
      "Take part in thoughtful conversation on tea, Japanese aesthetics, and cultural sensibilities.",
      "Enjoy a private session designed for presence, attention, and small-group depth.",
    ],
    fullDescription: [
      "This is not a setting for presenting a finished performance, but a private moment opened for sharing tea in a more attentive way.",
      "In a quiet tea room in Kyoto, water is heated over real charcoal, and tea is prepared with care. From the gestures, the atmosphere, and the interplay of sound and stillness, conversation begins to unfold naturally.",
      "Guided by a Kyoto-based tea practitioner rooted in the Urasenke tradition, this experience invites guests to encounter tea not as title or status, but as a practice deepened through daily repetition.",
      "This is not a staged performance, nor a lesson built around formal explanation.",
      "Guests are invited to take part directly: to observe, to listen, to make tea themselves, and to respond in their own words through thoughtful conversation.",
      "The session is shaped through making tea, real charcoal, quiet attention, and dialogue. It is designed for guests who seek stillness, depth, and a cultural experience that goes beyond the surface.",
    ],
    included: [
      "Private tea experience for up to 5 guests",
      "Guidance by an English-speaking tea practitioner",
      "Japanese sweets",
      "Tea prepared and shared during the session",
      "Hands-on participation in making tea",
      "Use of tea utensils during the session",
    ],
    meetingPoint: {
      description:
        "The experience takes place in a quiet tea room in Kyoto. The exact location will be shared after booking.",
      access: [
        "18 minutes on foot from Kinkaku-ji Temple, the Golden Pavilion",
        "13 minutes on foot from Daitokuji Temple",
        "8 minutes on foot from Kenkun Shrine",
      ],
    },
    importantInformation: [
      "No prior knowledge of tea is required.",
      "Seiza is traditional, but not required.",
      "Please wear comfortable clothing suitable for sitting.",
      "The experience is conducted in English.",
    ],
    notAllowed: [
      "Photography during the session",
      "Video recording during the session",
      "Strong perfume or strong fragrances",
    ],
    bookingHref: "/en/booking",
    galleryImages: [
      {
        src: "/images/experiences/TeaExJack/slide-01.jpg",
        alt: "Tea room with charcoal fire",
      },
      {
        src: "/images/experiences/TeaExJack/slide-02.jpg",
        alt: "Preparing tea in Kyoto",
      },
      {
        src: "/images/experiences/TeaExJack/slide-03.jpg",
        alt: "Traditional tea utensils",
      },
      {
        src: "/images/experiences/TeaExJack/slide-04.jpg",
        alt: "Tea room with charcoal fire",
      },
      {
        src: "/images/experiences/TeaExJack/slide-05.jpg",
        alt: "Preparing tea in Kyoto",
      },
      {
        src: "/images/experiences/TeaExJack/slide-06.jpg",
        alt: "Traditional tea utensils",
      },
    ],
  },
  {
    slug: "ZenExJirai",
    title: "Kyoto: Zen Experience with Jirai",
    cardTitle: "Zen Experience with Jirai",
    shortDescription:
      "A Zen-centered experience in Kyoto, where you explore your experience of Japan through dialogue with a Zen monk.",
    cardShortDescription:
      "A Zen-centered experience in Kyoto, where you explore your experience of Japan through dialogue with a Zen monk.",
    pricing: {
      type: "perPerson",
      amount: 16000,
      currency: "JPY",
      displayPrice: "¥16,000",
      unit: "per guest",
      minGuests: 3,
      maxGuests: 9,
      stripePriceId: null,
    },
    duration: {
      minutes: 90,
      display: "Approximately 90 minutes",
    },
    host: {
      name: "Jirai Mehl",
      role: "Kyoto-based zen monk",
      languages: ["English", "German"],
    },
    cancellation: {
      summary: "Free cancellation",
      text: "Free cancellation up to 7 days before the experience. Cancellations made less than 7 days before the experience are non-refundable. Date changes may be possible depending on availability.",
    },
    highlights: [],
    fullDescription: [],
    included: [],
    meetingPoint: {
      description: "",
      access: [],
    },
    importantInformation: [],
    notAllowed: ["Strong perfume or strong fragrances"],
    bookingHref: "/en/booking",
    galleryImages: [
      {
        src: "/images/experiences/ZenExJirai/slide-01.jpg",
        alt: "Zen monk speaking with guests",
      },
      {
        src: "/images/experiences/ZenExJirai/slide-02.jpg",
        alt: "Zen monk speaking with guests",
      },
      {
        src: "/images/experiences/ZenExJirai/slide-03.jpg",
        alt: "Zen monk speaking with guests",
      },
      {
        src: "/images/experiences/ZenExJirai/slide-04.jpg",
        alt: "Zen monk speaking with guests",
      },
      {
        src: "/images/experiences/ZenExJirai/slide-05.jpg",
        alt: "Zen monk speaking with guests",
      },
      {
        src: "/images/experiences/ZenExJirai/slide-06.jpg",
        alt: "Traditional tea utensils",
      },
    ],
  },
];
