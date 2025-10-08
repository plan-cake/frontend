// app/_lib/availability.ts

import { fromZonedTime } from "date-fns-tz";
import { AvailabilitySet } from "@/app/_lib/availability/types";

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

// Converts a local time representation to a UTC ISO string
export function getUtcIsoString(
  dateKey: string, // "YYYY-MM-DD"
  hour: number,
  minute: number,
  timezone: string,
): string {
  const localDateTimeString = `${dateKey}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  const utcDate = fromZonedTime(localDateTimeString, timezone);
  return utcDate.toISOString();
}

// Gets a UTC ISO slot for a specific date and time
export function getUtcIsoSlot(
  dateKey: string,
  hour: number,
  minute: number,
  timezone: string,
): { utcDate: Date; isoString: string } {
  const localDateTimeString = `${dateKey}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  const utcDate = fromZonedTime(localDateTimeString, timezone);
  return { utcDate, isoString: utcDate.toISOString() };
}
