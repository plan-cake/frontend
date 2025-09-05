// app/_lib/schedule.ts

import {
  DaySlot,
  EventRange,
  SpecificDateRange,
  WeekdayRange,
  TimeSlot,
  WeekdayMap,
} from "@/app/_lib/schedule/types";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export function checkDateInRange(date: Date, eventRange: EventRange): boolean {
  if (eventRange.type === "specific") {
    const { from, to } = eventRange.dateRange;
    if (!from || !to) {
      return false;
    }
    return date >= from && date < to;
  } else if (eventRange.type === "weekday") {
    const weekdays = eventRange.weekdays;

    const weekday = date.toLocaleDateString("en-US", {
      weekday: "short",
    }) as keyof typeof weekdays;
    return weekdays[weekday] == 0 ? false : true;
  }
  return false;
}

function combineDateAndTime(date: Date, time: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      time.getUTCHours(),
      time.getUTCMinutes(),
      time.getUTCSeconds(),
      time.getUTCMilliseconds(),
    ),
  );
}

/**
 * expands a high-level EventRange into a concrete list of days and time slots.
 *
 * this is the main entry point for generating the data needed for the UI.
 */
export function expandEventRange(
  range: EventRange,
  userTimezone: string,
): DaySlot[] {
  console.log("expandEventRange", range, userTimezone);
  if (range.type === "specific") {
    return generateSlotsForSpecificRange(range, userTimezone);
  }
  if (range.type === "weekday") {
    return generateSlotsForWeekdayRange(range, userTimezone);
  }
  return [];
}

function generateSlotsForSpecificRange(
  range: SpecificDateRange,
  userTimezone: string,
): DaySlot[] {
  const daySlots: DaySlot[] = [];
  const { dateRange, timeRange } = range;

  if (!dateRange.from || !dateRange.to || !timeRange.from || !timeRange.to) {
    return [];
  }

  // 1. Get the absolute start and end times in UTC
  const absoluteStartUTC = combineDateAndTime(dateRange.from, timeRange.from);
  const absoluteEndUTC = combineDateAndTime(dateRange.to, timeRange.to);

  // 2. Convert these UTC times to the viewer's local timezone
  const localStartDate = toZonedTime(absoluteStartUTC, userTimezone);
  const localEndDate = toZonedTime(absoluteEndUTC, userTimezone);

  // 3. Set up a loop that iterates through the calendar days in the local timezone
  let currentDay = new Date(localStartDate);
  currentDay.setHours(0, 0, 0, 0); // Start the loop at the beginning of the local start day

  const startHour = timeRange.from.getHours();
  const endHour = timeRange.to.getHours();

  while (currentDay <= localEndDate) {
    // get the weekday and month/day labels
    const weekday = currentDay
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
    const monthDay = currentDay
      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
      .toUpperCase();
    const dayKey = new Date(
      currentDay.getFullYear(),
      currentDay.getMonth(),
      currentDay.getDate(),
    ).toLocaleDateString("en-CA");

    // generate 15-minute time slots
    let slots: TimeSlot[] = [];
    let currentTime = new Date(currentDay);
    currentTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(currentDay);
    endTime.setHours(endHour, 0, 0, 0);
    while (currentTime.getTime() <= endTime.getTime()) {
      const timeSlot: TimeSlot = {
        date: new Date(currentDay),
        time: new Date(currentTime),
        day: `${weekday} ${monthDay}`,
      };
      slots.push(timeSlot);

      currentTime.setMinutes(currentTime.getMinutes() + 15);
    }

    daySlots.push({
      date: currentDay,
      dayLabel: `${weekday} ${monthDay}`,
      dayKey: dayKey,
      timeslots: slots,
    });
    currentDay.setDate(currentDay.getDate() + 1);
  }

  return daySlots;
}

export function generateSlotsForWeekdayRange(
  range: WeekdayRange,
  userTimezone: string,
): DaySlot[] {
  if (!range.timeRange.from || !range.timeRange.to) return [];

  const daySlotsMap = new Map<string, DaySlot>();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // anchor date to user's current week
  const nowInViewerTz = toZonedTime(new Date(), userTimezone);
  const startOfWeekInViewerTz = new Date(nowInViewerTz);
  startOfWeekInViewerTz.setDate(
    nowInViewerTz.getDate() - nowInViewerTz.getDay(),
  );

  // iterate through the next 7 days
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeekInViewerTz);
    currentDay.setDate(startOfWeekInViewerTz.getDate() + i);

    const dayName = daysOfWeek[currentDay.getDay()] as keyof WeekdayMap;

    // if the current weekday is selected in the event range, generate its slots
    if (range.weekdays[dayName]) {
      const dateString = currentDay.toLocaleDateString("en-CA"); // YYYY-MM-DD

      // get event's start/end times (as UTC hours/minutes)
      const startHour = range.timeRange.from.getUTCHours();
      const startMinute = range.timeRange.from.getUTCMinutes();
      const endHour = range.timeRange.to.getUTCHours();
      const endMinute = range.timeRange.to.getUTCMinutes();

      // create absolute start/end times by combining the viewer's current day
      // with the event's time, interpreted in the event's original timezone.
      const eventStartString = `${dateString}T${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}:00`;
      const eventEndString = `${dateString}T${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}:00`;

      let slotStartUTC = fromZonedTime(eventStartString, range.timezone);
      let slotEndUTC = fromZonedTime(eventEndString, range.timezone);

      // Handle overnight time ranges (e.g., 10 PM to 2 AM)
      if (slotEndUTC <= slotStartUTC) {
        slotEndUTC.setDate(slotEndUTC.getDate() + 1);
      }

      // 5. Generate 15-minute time slots between the absolute start and end times
      let currentSlotTime = new Date(slotStartUTC);
      while (currentSlotTime < slotEndUTC) {
        // Determine which day this slot falls on in the *viewer's* timezone
        const viewerDay = toZonedTime(currentSlotTime, userTimezone);
        const dayKey = viewerDay.toLocaleDateString("en-CA");

        // If we haven't seen this day before, create a new DaySlot entry
        if (!daySlotsMap.has(dayKey)) {
          const weekday = viewerDay
            .toLocaleDateString("en-US", {
              weekday: "short",
              timeZone: userTimezone,
            })
            .toUpperCase();
          const monthDay = viewerDay
            .toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              timeZone: userTimezone,
            })
            .toUpperCase();

          daySlotsMap.set(dayKey, {
            date: new Date(
              viewerDay.getFullYear(),
              viewerDay.getMonth(),
              viewerDay.getDate(),
            ),
            dayLabel: `${weekday} ${monthDay}`,
            dayKey: dayKey,
            timeslots: [],
          });
        }

        // Add the current slot to the correct day
        const daySlot = daySlotsMap.get(dayKey)!;
        daySlot.timeslots.push({
          date: new Date(currentSlotTime),
          time: new Date(currentSlotTime),
          day: dayName,
        });

        currentSlotTime.setMinutes(currentSlotTime.getMinutes() + 15);
      }
    }
  }

  // Convert the map to a sorted array
  return Array.from(daySlotsMap.values()).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
}
