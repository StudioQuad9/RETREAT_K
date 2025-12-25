// @/src/lib/utils/formatDuration.js

export function formatDuration(value) {
  const minutes = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(minutes) || minutes < 0) return "";  

  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  const hourLabel = hours === 1 ? "hour" : "hours";
  const minuteLabel = restMinutes === 1 ? "minute" : "minutes";

  if (hours === 0) {
    return `${restMinutes} ${minuteLabel}`;
  } else if (restMinutes === 0) {
    return `${hours} ${hourLabel}`;
  }
  return `${hours} ${hourLabel} ${restMinutes} ${minuteLabel}`;
};
