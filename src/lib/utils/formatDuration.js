// @/src/lib/utils/formatDuration.js

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  if (restMinutes === 0) {
    return `${hours} hours`;
  }
  return `${hours} hours ${restMinutes} minutes`;
};
