// app/_lib/availability.ts

import { fromZonedTime } from "date-fns-tz";
import { UserAvailability } from "@/app/_lib/availability/types";
import { EventRange } from "@/app/_lib/schedule/types";

// Creates an empty UserAvailability object
export const createEmptyUserAvailability = (
  type: "specific" | "weekday" = "specific",
): UserAvailability => ({
  type,
  selections: new Set<string>(),
});

// Toggles a single time slot in the user's availability
export function toggleUtcSlot(
  prev: UserAvailability,
  isoString: string,
): UserAvailability {
  const updated = new Set(prev.selections);
  if (updated.has(isoString)) {
    updated.delete(isoString);
  } else {
    updated.add(isoString);
  }
  return { ...prev, selections: updated };
}

// Checks if a specific time slot is in the user's availability
export function isSlotSelected(
  availability: UserAvailability,
  isoString: string,
): boolean {
  return availability.selections.has(isoString);
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
