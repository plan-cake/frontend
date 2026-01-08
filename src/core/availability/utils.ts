import { AvailabilitySet } from "@/core/availability/types";

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
    if (
      current.getHours() * 60 + current.getMinutes() <
      start.getHours() * 60 + start.getMinutes()
    ) {
      // Avoid wrapping to the next day around midnight
      current.setHours(start.getHours(), start.getMinutes());
    }
    const currentMinutes = current.getHours() * 60 + current.getMinutes();
    if (currentMinutes > endMinutes) {
      current.setHours(start.getHours(), start.getMinutes());
      current.setDate(current.getDate() + 1);
    }
  }
  return slots;
}
