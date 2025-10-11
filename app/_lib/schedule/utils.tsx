// app/_lib/schedule.ts

import {
  EventRange,
  WeekdayRange,
  WeekdayMap,
  Weekday,
  days,
} from "@/app/_lib/schedule/types";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import { getHours, getMinutes, startOfDay } from "date-fns";

/**
 * expands a high-level EventRange into a concrete list of days and time slots
 * for the user's  local timezone
 */
export function expandEventRange(range: EventRange): Date[] {
  if (range.type === "specific") {
    return generateSlotsForSpecificRange(range);
  } else if (range.type === "weekday") {
    return generateSlotsForWeekdayRange(range);
  }
  return [];
}

function generateSlotsForSpecificRange(range: EventRange): Date[] {
  const slots: Date[] = [];
  if (
    range.type !== "specific" ||
    !range.dateRange.from ||
    !range.dateRange.to
  ) {
    return [];
  }

  // Get the absolute start and end times in UTC
  const startDateString = range.dateRange.from.split("T")[0];
  const endDateString = range.dateRange.to.split("T")[0];
  const startTimeString = String(range.timeRange.from).padStart(2, "0");
  const endTimeString =
    range.timeRange.to == 24
      ? "23:59"
      : String(range.timeRange.to).padStart(2, "0");
  const eventStartUTC = fromZonedTime(
    `${startDateString}T${startTimeString}`,
    range.timezone,
  );
  const eventEndUTC = fromZonedTime(
    `${endDateString}T${endTimeString}`,
    range.timezone,
  );

  // Get the valid time range for any given day in UTC
  const validStartHour = range.timeRange.from;
  const validEndHour = range.timeRange.to;

  let currentUTC = new Date(eventStartUTC);

  while (currentUTC <= eventEndUTC) {
    // Get the time-of-day part of the current date
    const zonedCurrent = toZonedTime(currentUTC, range.timezone);

    const currentHour = getHours(zonedCurrent);
    const currentMinute = getMinutes(zonedCurrent);

    const isAfterStartTime =
      currentHour > validStartHour ||
      (currentHour === validStartHour && currentMinute >= 0);

    const isBeforeEndTime =
      currentHour < validEndHour ||
      (currentHour === validEndHour && currentMinute < 0);

    if (isAfterStartTime && isBeforeEndTime) {
      slots.push(new Date(currentUTC));
    }

    currentUTC.setUTCMinutes(currentUTC.getUTCMinutes() + 15);
  }

  return slots;
}

function generateSlotsForWeekdayRange(range: WeekdayRange): Date[] {
  const slots: Date[] = [];
  if (range.type !== "weekday") {
    return [];
  }

  const dayNameToIndex: { [key: string]: number } = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const selectedDayIndexes = new Set<number>();
  for (const dayName in range.weekdays) {
    if (range.weekdays[dayName as keyof WeekdayMap] === 1) {
      selectedDayIndexes.add(dayNameToIndex[dayName]);
    }
  }

  if (selectedDayIndexes.size === 0) {
    return [];
  }

  const now = new Date();
  const startOfTodayInTz = startOfDay(toZonedTime(now, range.timezone));
  const startOfWeekInViewerTz = new Date(startOfTodayInTz);
  startOfWeekInViewerTz.setDate(
    startOfTodayInTz.getDate() - startOfTodayInTz.getDay(),
  );

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeekInViewerTz);
    currentDay.setDate(startOfWeekInViewerTz.getDate() + i);
    if (selectedDayIndexes.has(currentDay.getDay())) {
      const dateString = formatInTimeZone(
        currentDay,
        range.timezone,
        "yyyy-MM-dd",
      );

      const startTimeString =
        String(range.timeRange.from).padStart(2, "0") + ":00";
      const endTimeString =
        range.timeRange.to == 24
          ? "23:59"
          : String(range.timeRange.to).padStart(2, "0");

      let slotTimeUTC = fromZonedTime(
        `${dateString}T${startTimeString}`,
        range.timezone,
      );
      const dayEndUTC = fromZonedTime(
        `${dateString}T${endTimeString}`,
        range.timezone,
      );

      while (slotTimeUTC < dayEndUTC) {
        if (slotTimeUTC >= startOfWeekInViewerTz) {
          slots.push(new Date(slotTimeUTC));
        }
        slotTimeUTC.setUTCMinutes(slotTimeUTC.getUTCMinutes() + 15);
      }
    }
  }

  return slots;
}

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
