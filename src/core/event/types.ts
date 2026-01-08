// app/_types/schedule.ts

export type EventInformation = {
  title: string;
  customCode: string;
  eventRange: EventRange;
  timeslots: Date[];
};

// discriminated union for event ranges - this is your single source of truth
export type EventRange = SpecificDateRange | WeekdayRange;

// represents selected weekdays
export type Weekday = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
export type WeekdayMap = {
  [day in Weekday]: 0 | 1;
};

export const days: Array<Weekday> = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export type WeekdayTimeRange = {
  slotTimeUTC: Date;
  dayEndUTC: Date;
};

/* EVENT RANGE MODELS */

export type SpecificDateRange = {
  type: "specific";
  duration: number;
  timezone: string;
  dateRange: {
    from: string;
    to: string;
  };
  timeRange: {
    from: string;
    to: string;
  };
};

export type WeekdayRange = {
  type: "weekday";
  duration: number;
  timezone: string;
  weekdays: WeekdayMap;
  timeRange: {
    from: string;
    to: string;
  };
};

/* SLOTS TYPES FOR UI */
// these types are generated from the core models above for rendering

export type DaySlot = {
  date: Date; // date for the entire day
  dayLabel: string; // e.g., "MON MAY 10"
  dayKey: string; // e.g., "2025-05-10"
  timeslots: Date[];
};
