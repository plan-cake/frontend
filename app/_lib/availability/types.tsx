// app/_types/availability.ts

// a set containing ISO strings of selected UTC date-time slots
export type AvailabilitySet = Set<Date>;

// represents a user's complete set of available times
export type UserAvailability = {
  type: "specific" | "weekday";
  selections: AvailabilitySet;
};
