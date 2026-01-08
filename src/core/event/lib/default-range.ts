import { SpecificDateRange, WeekdayRange } from "@/core/event/types";

const defaultTimeRange = { from: "09:00", to: "17:00" };

export const DEFAULT_RANGE_SPECIFIC: SpecificDateRange = {
  type: "specific" as const,
  duration: 60,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateRange: {
    from: new Date().toISOString(),
    to: new Date().toISOString(),
  },
  timeRange: defaultTimeRange,
};

export const DEFAULT_RANGE_WEEKDAY: WeekdayRange = {
  type: "weekday" as const,
  duration: 30,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  weekdays: { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 },
  timeRange: defaultTimeRange,
};
