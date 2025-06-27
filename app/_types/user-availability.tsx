import { fromZonedTime } from "date-fns-tz";

// keys are either weekdays or specific date strings:
//    for specific days:  "2025-05-10"
//    for weekdays: "Mon", "Tue", etc.
// values are sets timeslots where the user is available
export type AvailabilitySet = Set<string>; // each string = ISO UTC datetime (start of timeslot)

export type UserAvailability = {
  type: "specific" | "weekday";
  selections: AvailabilitySet;
};

// Initialize empty availability
export const createEmptyUserAvailability = (
  type: "specific" | "weekday" = "specific",
): UserAvailability => ({
  type,
  selections: new Set<string>(),
});

// Toggle a cell's availability (add/remove hour from Set)
export function toggleUtcSlot(
  prev: UserAvailability,
  iso: string,
): UserAvailability {
  const updated = new Set(prev.selections);
  if (updated.has(iso)) {
    updated.delete(iso);
  } else {
    updated.add(iso);
  }
  return { ...prev, selections: updated };
}

// Check if a user is available at a specific key + hour
export function isAvailable(user: UserAvailability, iso: string): boolean {
  return user.selections.has(iso);
}

export function getUtcIsoSlot(
  dateKey: string,
  hour: number,
  minute: number,
  timezone: string,
): string {
  const localDateTimeString = `${dateKey}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  const utcDate = fromZonedTime(localDateTimeString, timezone);
  return utcDate.toISOString();
}
