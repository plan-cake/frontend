import { eachDayOfInterval, parseISO } from "date-fns";
import { AvailabilitySet } from "@/src/core/availability/types";
import {
  EventRange,
  SpecificDateRange,
  WeekdayRange,
} from "@/src/core/event/types";
import {
  getAbsoluteDateRangeInUTC,
  getSelectedWeekdaysInTimezone,
} from "@/src/features/event/grid/lib/expand-event-range";

// Creates an empty UserAvailability object
export const createEmptyUserAvailability = (): AvailabilitySet => {
  return new Set<string>();
};

export const createUserAvailability = (
  data: Array<string>,
): AvailabilitySet => {
  return new Set<string>(data);
};

// Toggles a single time slot in the user's availability
export function toggleUtcSlot(
  prev: AvailabilitySet,
  timeSlot: string, // ISO string
  togglingOn: boolean,
): AvailabilitySet {
  const updated = new Set(prev);
  if (togglingOn) {
    updated.add(timeSlot);
  } else {
    updated.delete(timeSlot);
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
    const { slotTimeUTC, dayEndUTC } = day;

    while (slotTimeUTC < dayEndUTC) {
      daySlots.push(isSlotSelected(availability, slotTimeUTC));
      slotTimeUTC.setUTCMinutes(slotTimeUTC.getUTCMinutes() + 15);
    }

    return daySlots;
  });

  return grid;
}

function sortDateRange(start: Date, end: Date): [Date, Date] {
  // given a start date and end date, it separately sorts the time and date components
  // and returns two new dates, such that the first has both the earlier date and time
  const startTime = new Date(start);
  const endTime = new Date(end);
  startTime.setFullYear(1970, 0, 1);
  endTime.setFullYear(1970, 0, 1);
  if (startTime > endTime) {
    const temp = new Date(startTime);
    startTime.setTime(endTime.getTime());
    endTime.setTime(temp.getTime());
  }
  const startDate = start < end ? start : end;
  const endDate = start < end ? end : start;
  startDate.setHours(startTime.getHours(), startTime.getMinutes());
  endDate.setHours(endTime.getHours(), endTime.getMinutes());
  return [startDate, endDate];
}

export function generateDragSlots(
  dragStart: string,
  dragEnd: string,
): Set<string> {
  const slots = new Set<string>();
  const [start, end] = sortDateRange(new Date(dragStart), new Date(dragEnd));
  const current = new Date(start);
  const endMinutes = end.getHours() * 60 + end.getMinutes();
  while (current <= end) {
    slots.add(current.toISOString());
    current.setMinutes(current.getMinutes() + 15);
    const currentMinutes = current.getHours() * 60 + current.getMinutes();
    if (currentMinutes > endMinutes) {
      current.setHours(start.getHours(), start.getMinutes());
      current.setDate(current.getDate() + 1);
    }
  }
  return slots;
}
