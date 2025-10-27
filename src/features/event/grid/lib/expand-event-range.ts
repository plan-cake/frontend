import { getHours, getMinutes } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

import {
  EventRange,
  SpecificDateRange,
  WeekdayRange,
  WeekdayTimeRange,
  WeekdayMap,
} from "@/core/event/types";

/* EXPAND EVENT RANGE UTILITIES */

function getTimeStrings(timeRange: { from: number; to: number }) {
  const fromHour = String(timeRange.from).padStart(2, "0");
  const toHour =
    timeRange.to === 24 ? "23:59" : String(timeRange.to).padStart(2, "0");
  return { fromHour, toHour };
}

export function getAbsoluteDateRangeInUTC(eventRange: SpecificDateRange): {
  eventStartUTC: Date;
  eventEndUTC: Date;
} {
  const startDateString = eventRange.dateRange.from.split("T")[0];
  const endDateString = eventRange.dateRange.to.split("T")[0];
  const { fromHour: startTimeString, toHour: endTimeString } = getTimeStrings(
    eventRange.timeRange,
  );
  const eventStartUTC = fromZonedTime(
    `${startDateString}T${startTimeString}`,
    eventRange.timezone,
  );
  const eventEndUTC = fromZonedTime(
    `${endDateString}T${endTimeString}`,
    eventRange.timezone,
  );

  return { eventStartUTC, eventEndUTC };
}

export function getSelectedWeekdaysInTimezone(
  range: WeekdayRange,
): WeekdayTimeRange[] {
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

  // 01/01/2012 is a sunday
  const startOfWeekInViewerTz = fromZonedTime(
    "2012-01-01T00:00:00",
    range.timezone,
  );

  const { fromHour: startTimeString, toHour: endTimeString } = getTimeStrings(
    range.timeRange,
  );

  const selectedDatesUTC: WeekdayTimeRange[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeekInViewerTz);
    currentDay.setDate(startOfWeekInViewerTz.getDate() + i);
    if (selectedDayIndexes.has(currentDay.getDay())) {
      const dateString = formatInTimeZone(
        currentDay,
        range.timezone,
        "yyyy-MM-dd",
      );

      const slotTimeUTC = fromZonedTime(
        `${dateString}T${startTimeString}`,
        range.timezone,
      );
      const dayEndUTC = fromZonedTime(
        `${dateString}T${endTimeString}`,
        range.timezone,
      );

      selectedDatesUTC.push({ slotTimeUTC, dayEndUTC });
    }
  }

  return selectedDatesUTC;
}

/**
 * expands a high-level EventRange into a concrete list of days and time slots
 * for the user's  local timezone
 */
export function expandEventRange(range: EventRange): Date[] {
  if (range.type === "specific") {
    return generateSlotsForSpecificRange(range);
  } else {
    return generateSlotsForWeekdayRange(range);
  }
}

function generateSlotsForSpecificRange(range: SpecificDateRange): Date[] {
  const slots: Date[] = [];
  if (!range.dateRange.from || !range.dateRange.to) {
    return [];
  }

  // Get the absolute start and end times in UTC
  const { eventStartUTC, eventEndUTC } = getAbsoluteDateRangeInUTC(range);

  // Get the valid time range for any given day in UTC
  const validStartHour = range.timeRange.from;
  const validEndHour = range.timeRange.to;

  const currentUTC = new Date(eventStartUTC);

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

  const selectedDays = getSelectedWeekdaysInTimezone(range);
  if (selectedDays.length === 0) {
    return [];
  }

  for (const day of selectedDays) {
    const { slotTimeUTC, dayEndUTC } = day;

    while (slotTimeUTC < dayEndUTC) {
      slots.push(new Date(slotTimeUTC));
      slotTimeUTC.setUTCMinutes(slotTimeUTC.getUTCMinutes() + 15);
    }
  }

  return slots;
}
