// @/src/lib/utils/formatDuration.js

export function formatDuration(value) {
  const minutes = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(minutes) || minutes < 0) return "";  

  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  if (hours === 0) {
    return `${restMinutes} ${restMinutes === 1 ? "minute" : "minutes"}`;
  } else if (restMinutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }
  return `${hours} hours ${restMinutes} minutes`;
};
