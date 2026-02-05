import { Weekday, ALL_WEEKDAYS } from "@/core/event/types";

export function createWeekdayArray(
  startDay: number,
  endDay: number,
): Weekday[] {
  if (startDay === -1 || endDay === -1) {
    return [];
  }

  return ALL_WEEKDAYS.slice(startDay, endDay + 1);
}

export function findRangeFromWeekdayArray(selectedDays: Weekday[]): {
  startDay: Weekday | null;
  endDay: Weekday | null;
} {
  if (selectedDays.length === 0) {
    return { startDay: null, endDay: null };
  }

  return {
    startDay: selectedDays[0],
    endDay: selectedDays[selectedDays.length - 1],
  };
}
