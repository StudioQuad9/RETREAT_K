// @/lib/utils/buildSchedule.js

const WEEKDAY_LABEL = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUN: "Sun",
};

export function buildScheduleText(exp) {
  return exp?.scheduleDetails
    ? exp.scheduleDetails.map((schedule) => {
      const weekday = WEEKDAY_LABEL[schedule.weekday] ?? schedule.weekday;
      return `${weekday} ${schedule.time}`;
    })
    .join(", ")
    : "";
}

const WEEKDAY_INDEX = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

export function buildScheduleIndex(exp) {
  if (!exp?.scheduleDetails) return [];
  return (
    exp?.scheduleDetails.map((schedule) => {
      return WEEKDAY_INDEX[schedule.weekday]
    }).filter((idx) => Number.isFinite(idx))
  );
}