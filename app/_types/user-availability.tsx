// keys are either weekdays or specific date strings:
//    for specific days:  "2025-05-10"
//    for weekdays: "Mon", "Tue", etc.
// values are sets timeslots where the user is available
export type AvailabilityMap = Record<string, Set<number>>;

export type UserAvailability = {
  type: "specific" | "weekday";
  selections: AvailabilityMap;
};

// Initialize empty availability
export const createEmptyUserAvailability = (
  type: "specific" | "weekday" = "specific",
): UserAvailability => ({
  type,
  selections: {},
});

// Toggle a cell's availability (add/remove hour from Set)
export function toggleAvailability(
  prev: UserAvailability,
  key: string,
  hour: number,
): UserAvailability {
  const updated = { ...prev, selections: { ...prev.selections } };
  const hours = new Set(updated.selections[key] || []);

  if (hours.has(hour)) {
    hours.delete(hour);
  } else {
    hours.add(hour);
  }

  updated.selections[key] = hours;
  return updated;
}

// Check if a user is available at a specific key + hour
export function isAvailable(
  user: UserAvailability,
  key: string,
  hour: number,
): boolean {
  return user.selections[key]?.has(hour) ?? false;
}

// Add multiple hours for drag selection
export function addAvailability(
  prev: UserAvailability,
  key: string,
  hour: number,
): UserAvailability {
  const updated = { ...prev, selections: { ...prev.selections } };
  const hours = new Set(updated.selections[key] || []);
  hours.add(hour);
  updated.selections[key] = hours;
  return updated;
}

// Remove hours for drag deselection (optional if you want toggling behavior)
export function removeAvailability(
  prev: UserAvailability,
  key: string,
  hour: number,
): UserAvailability {
  const updated = { ...prev, selections: { ...prev.selections } };
  const hours = new Set(updated.selections[key] || []);
  hours.delete(hour);
  updated.selections[key] = hours;
  return updated;
}
