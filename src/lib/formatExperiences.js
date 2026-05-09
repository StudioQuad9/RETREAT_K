// @/lib/formatExperiences.js

export function getGuestText(pricing) {
  if (pricing.type === "privateGroup") {
    return `Up to ${pricing.maxGuests} guests`;
  }
  return `${pricing.minGuests}-${pricing.maxGuests} guests`;
}

export function getDurationText(duration) {
  return duration.display;
}

export function getMinimumGuestText(pricing) {
  if (pricing.type !== "prePerson") {
    return null;
  }
  return `Mimimun ${pricing.minGuests} guests required`;
}
