import { WeekdayMap, Weekday, days } from "@/src/core/event/types";

export function generateWeekdayMap(
  startDay: number,
  endDay: number,
): WeekdayMap {
  const weekdays: WeekdayMap = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  for (let i = startDay; i <= endDay; i++) {
    const dayKey: Weekday = days[i];
    weekdays[dayKey] = 1;
  }
  return weekdays;
}

export function findRangeFromWeekdayMap(selectedDays: WeekdayMap): {
  startDay: Weekday | null;
  endDay: Weekday | null;
} {
  const selected = days.filter((day) => selectedDays[day] === 1);

  if (selected.length === 0) {
    return { startDay: null, endDay: null };
  }

  return {
    startDay: selected[0],
    endDay: selected[selected.length - 1],
  };
}
