import { eachDayOfInterval, parseISO } from "date-fns";
import { AvailabilitySet } from "@/app/_lib/availability/types";
import { EventRange, SpecificDateRange, WeekdayRange } from "../schedule/types";
import {
  getAbsoluteDateRangeInUTC,
  getSelectedWeekdaysInTimezone,
} from "@/app/_lib/schedule/utils";

// Creates an empty UserAvailability object
export const createEmptyUserAvailability = (): AvailabilitySet => {
  return new Set<string>();
};

// Toggles a single time slot in the user's availability
export function toggleUtcSlot(
  prev: AvailabilitySet,
  timeSlot: string, // ISO string
): AvailabilitySet {
  const updated = new Set(prev);
  if (updated.has(timeSlot)) {
    updated.delete(timeSlot);
  } else {
    updated.add(timeSlot);
  }
  return updated;
}

// Checks if a specific time slot is in the user's availability
export function isSlotSelected(
  availability: AvailabilitySet,
  timeSlot: Date,
): boolean {
  return availability.has(timeSlot.toISOString());
}

// converts set to grid for api
export function convertAvailabilityToGrid(
  availability: AvailabilitySet,
  eventRange: EventRange,
): boolean[][] {
  if (eventRange.type === "specific") {
    return convertAvailabilityToGridForSpecificRange(availability, eventRange);
  } else {
    return convertAvailabilityToGridForWeekdayRange(availability, eventRange);
  }
}

function convertAvailabilityToGridForSpecificRange(
  availability: AvailabilitySet,
  eventRange: SpecificDateRange,
): boolean[][] {
  const { eventStartUTC, eventEndUTC } = getAbsoluteDateRangeInUTC(eventRange);
  console.log({ eventStartUTC, eventEndUTC });
  const startTime = eventStartUTC.getHours();
  const endTime =
    eventEndUTC.getMinutes() === 59
      ? eventEndUTC.getHours() + 1
      : eventEndUTC.getHours();

  const days = eachDayOfInterval({
    start: parseISO(eventStartUTC.toISOString()),
    end: parseISO(eventEndUTC.toISOString()),
  });

  const grid: boolean[][] = days.map((day) => {
    const daySlots: boolean[] = [];

    for (let hour = startTime; hour < endTime; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const slot = new Date(day);
        slot.setHours(hour, minute);
        daySlots.push(isSlotSelected(availability, slot));
      }
    }

    return daySlots;
  });
  return grid;
}

function convertAvailabilityToGridForWeekdayRange(
  availability: AvailabilitySet,
  eventRange: WeekdayRange,
): boolean[][] {
  const selectedDays = getSelectedWeekdaysInTimezone(eventRange);

  const grid: boolean[][] = selectedDays.map((day) => {
    const daySlots: boolean[] = [];
    let { slotTimeUTC, dayEndUTC } = day;

    while (slotTimeUTC < dayEndUTC) {
      daySlots.push(isSlotSelected(availability, slotTimeUTC));
      slotTimeUTC.setUTCMinutes(slotTimeUTC.getUTCMinutes() + 15);
    }

    return daySlots;
  });

  return grid;
}
