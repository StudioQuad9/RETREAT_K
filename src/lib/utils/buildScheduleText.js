// @/src/lib/utils/buildScheduleText.js

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