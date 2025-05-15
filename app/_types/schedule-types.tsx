export type TimeDateRange = {
  from: Date | null;
  to: Date | null;
};

// generic weekday mode map
export type WeekdayMap = {
  [day in "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"]: 0 | 1;
};

// specific date mode
export type SpecificDateRange = {
  type: "specific";
  duration: number;
  timezone: string;
  dateRange: TimeDateRange;
  timeRange: TimeDateRange;
};

// generic weekday mode
export type WeekdayRange = {
  type: "weekday";
  duration: number;
  timezone: string;
  weekdays: WeekdayMap;
  timeRange: TimeDateRange;
};

// unified type
export type EventRange = SpecificDateRange | WeekdayRange;

export type DateTimeSlot = {
  day: string;
  from: Date;
  to: Date;
};

// Combine a date and a time-only object into a full Date object
export function combineDateAndTime(date: Date, time: Date): Date {
  const result = new Date(date);
  result.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return result;
}

// Generate all concrete weekday instances for a given reference week
export function generateConcreteInstancesForWeek(
  range: WeekdayRange,
  weekStart: Date,
): DateTimeSlot[] {
  const slots: DateTimeSlot[] = [];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const baseFrom = range.timeRange.from;
  const baseTo = range.timeRange.to;

  if (!baseFrom || !baseTo) return [];

  for (let i = 0; i < 7; i++) {
    const day = days[i] as keyof WeekdayMap;
    if (range.weekdays[day]) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);

      const from = combineDateAndTime(date, baseFrom);
      const to = combineDateAndTime(date, baseTo);

      slots.push({ day, from, to });
    }
  }

  return slots;
}

// Expand a specific date range into a list of dates (e.g., for previewing day-by-day)
export function expandDateRange(range: TimeDateRange): Date[] {
  const { from, to } = range;
  if (!from || !to) return [];
  const days: Date[] = [];

  let current = new Date(from);
  current.setHours(0, 0, 0, 0);

  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

// Format a weekday map into a list of active days (e.g., ["Mon", "Wed"])
export function getEnabledWeekdays(weekdays: WeekdayMap): string[] {
  return Object.entries(weekdays)
    .filter(([, v]) => v === 1)
    .map(([k]) => k);
}

// Create a list of visible day labels from a specific date range
export function getDateLabels({ from, to }: TimeDateRange): string[] {
  const labels: string[] = [];
  const range = expandDateRange({ from, to });
  for (const date of range) {
    const weekday = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
    const monthDay = date
      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
      .toUpperCase();
    labels.push(`${weekday} ${monthDay}`);
  }
  return labels;
}
