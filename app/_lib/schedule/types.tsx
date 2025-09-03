// app/_types/schedule.ts

// defines a time range, stored in UTC
export type TimeDateRange = {
  from: Date | null;
  to: Date | null;
};

// represents selected weekdays
export type WeekdayMap = {
  [day in "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"]: 0 | 1;
};

/* EVENT RANGE MODELS */

export type SpecificDateRange = {
  type: "specific";
  duration: number;
  timezone: string;
  dateRange: TimeDateRange;
  timeRange: TimeDateRange;
};

export type WeekdayRange = {
  type: "weekday";
  duration: number;
  timezone: string;
  weekdays: WeekdayMap;
  timeRange: TimeDateRange;
};

// discriminated union for event ranges - this is your single source of truth
export type EventRange = SpecificDateRange | WeekdayRange;

/* SLOTS TYPES FOR UI */
// these types are generated from the core models above for rendering

export type TimeSlot = {
  date: Date; // specific day
  time: Date; // specific time on that day
  day: string; // formatted day label (e.g., "MON MAY 10")
};

export type DaySlot = {
  date: Date; // date for the entire day
  dayLabel: string; // e.g., "MON MAY 10"
  dayKey: string; // e.g., "2025-05-10"
  timeslots: TimeSlot[];
};
