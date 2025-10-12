// a set containing ISO strings of selected UTC date-time slots
export type AvailabilitySet = Set<string>;

// ISO date string to array of participant names who are available at that time
export type ResultsAvailabilityMap = {
  [key: string]: string[];
};
