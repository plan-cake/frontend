import {
  addDays,
  addMinutes,
  eachDayOfInterval,
  isBefore,
  parseISO,
  format,
} from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import {
  EventRange,
  SpecificDateRange,
  WeekdayRange,
} from "@/core/event/types";
import { checkDateRange } from "@/features/event/editor/validate-data";

/* EXPAND EVENT RANGE UTILITIES */

/**
 * Generates 15-minute slots between two absolute UTC times.
 * range: [start, end)
 */
function generateSlotsBetween(startUTC: Date, endUTC: Date): Date[] {
  const slots: Date[] = [];
  let current = startUTC;

  while (isBefore(current, endUTC)) {
    slots.push(new Date(current));
    current = addMinutes(current, 15);
  }
  return slots;
}

/**
 * Constructs the absolute Start and End UTC times for a specific "calendar day"
 * in the target timezone, given the hour constraints.
 */
function getDailyBoundariesInUTC(
  dateIsoStr: string, // "YYYY-MM-DD"
  timezone: string,
  timeRange: { from: string; to: string },
) {
  // Construct ISO strings for the target timezone
  const startStr = `${dateIsoStr}T${timeRange.from}:00`;
  const startUTC = fromZonedTime(startStr, timezone);

  let endUTC: Date;
  if (timeRange.to === "00:00" || timeRange.to === "24:00") {
    const dateObj = parseISO(dateIsoStr);
    const nextDay = addDays(dateObj, 1);
    const nextDayStr = nextDay.toISOString().split("T")[0];
    endUTC = fromZonedTime(`${nextDayStr}T00:00:00`, timezone);
  } else {
    const endStr = `${dateIsoStr}T${timeRange.to}:00`;
    endUTC = fromZonedTime(endStr, timezone);
  }

  return { startUTC, endUTC };
}

/**
 * Expands a high-level EventRange into a concrete list of UTC time slots,
 * generated based on the event's timezone constraints.
 */
export function expandEventRange(range: EventRange): Date[] {
  if (range.type === "specific") {
    return generateSlotsForSpecificRange(range);
  } else {
    return generateSlotsForWeekdayRange(range);
  }
}

function generateSlotsForSpecificRange(range: SpecificDateRange): Date[] {
  if (!range.dateRange.from || !range.dateRange.to) {
    return [];
  }

  // Validate Duration
  const startDateStr = range.dateRange.from.split("T")[0];
  const endDateStr = range.dateRange.to.split("T")[0];

  const { startUTC: eventStartUTC } = getDailyBoundariesInUTC(
    startDateStr,
    range.timezone,
    range.timeRange,
  );
  const { endUTC: eventEndUTC } = getDailyBoundariesInUTC(
    endDateStr,
    range.timezone,
    range.timeRange,
  );

  if (checkDateRange(eventStartUTC, eventEndUTC)) {
    return [];
  }

  // Generate Slots
  const slots: Date[] = [];
  const days = eachDayOfInterval({
    start: parseISO(startDateStr),
    end: parseISO(endDateStr),
  });

  for (const day of days) {
    const dayStr = format(day, "yyyy-MM-dd");

    const { startUTC, endUTC } = getDailyBoundariesInUTC(
      dayStr,
      range.timezone,
      range.timeRange,
    );

    slots.push(...generateSlotsBetween(startUTC, endUTC));
  }

  return slots;
}

function generateSlotsForWeekdayRange(range: WeekdayRange): Date[] {
  if (range.type !== "weekday") return [];

  const slots: Date[] = [];
  const dayIndexMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  // generic reference week starting on a Sunday
  const referenceStart = new Date("2012-01-01T00:00:00");

  for (let i = 0; i < 7; i++) {
    // current day in the reference week
    const currentDay = addDays(referenceStart, i);
    const currentDayIndex = currentDay.getDay();
    const dayName = Object.keys(dayIndexMap).find(
      (key) => dayIndexMap[key] === currentDayIndex,
    );

    if (dayName && range.weekdays[dayName as keyof typeof range.weekdays]) {
      const dayStr = format(currentDay, "yyyy-MM-dd");

      const { startUTC, endUTC } = getDailyBoundariesInUTC(
        dayStr,
        range.timezone,
        range.timeRange,
      );

      slots.push(...generateSlotsBetween(startUTC, endUTC));
    }
  }

  return slots;
}
