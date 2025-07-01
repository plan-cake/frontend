export type TimeDateRange = {
  from: Date | null; // stored in UTC
  to: Date | null; // stored in UTC
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
  from: Date; // full date with time
  to: Date; // full date with time
};

export type TimeSlot = {
  date: Date; // date with time set to 00:00
  time: Date; // time-only object (hours and minutes)
  day: string; // abbreviated day name (e.g., "Mon", "Tue")
};

// Combine a date and a time-only object into a full Date object
export function combineDateAndTime(date: Date, time: Date): Date {
  const result = new Date(date);
  result.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return result;
}

// Expand an event range into a list of time slots in UTC
export function expandEventRange(range: EventRange): {
  expandedRange: TimeSlot[];
  timezone: string;
} {
  let expandedRange: TimeSlot[] = [];
  if (range.type === "specific") {
    expandedRange = generateConcreteInstancesForSpecificRange(range);
  } else if (range.type === "weekday") {
    expandedRange = generateConcreteInstancesForWeek(range);
  }

  return {
    expandedRange: expandedRange,
    timezone: "UTC",
  };
}

function generateConcreteInstancesForSpecificRange(
  range: SpecificDateRange,
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const { dateRange, timeRange } = range;

  if (!dateRange.from || !dateRange.to || !timeRange.from || !timeRange.to) {
    return [];
  }

  const startDate = new Date(dateRange.from);
  const endDate = new Date(dateRange.to);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const startHour = timeRange.from.getHours();
  const endHour = timeRange.to.getHours();

  let current = new Date(startDate);
  while (current <= endDate) {
    let currentTime = new Date(current);
    currentTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(current);
    endTime.setHours(endHour, 0, 0, 0);
    while (currentTime.getTime() <= endTime.getTime()) {
      const weekday = current
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();
      const monthDay = current
        .toLocaleDateString("en-US", { month: "short", day: "numeric" })
        .toUpperCase();

      const timeSlot: TimeSlot = {
        date: new Date(current),
        time: new Date(currentTime),
        day: `${weekday} ${monthDay}`,
      };
      slots.push(timeSlot);

      currentTime.setMinutes(currentTime.getMinutes() + 15);
    }

    current.setDate(current.getDate() + 1);
  }

  return slots;
}

// Generate all concrete weekday instances for a given reference week
function generateConcreteInstancesForWeek(range: WeekdayRange): TimeSlot[] {
  const slots: TimeSlot[] = [];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  if (!range.timeRange.from || !range.timeRange.to) return [];

  const baseFrom = range.timeRange.from.getHours();
  const baseTo = range.timeRange.to.getHours();

  const weekStart = new Date(); // Define weekStart as the current date
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Set to the start of the week (Sunday)

  for (let i = 0; i < 7; i++) {
    const day = days[i] as keyof WeekdayMap;
    if (range.weekdays[day]) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      date.setHours(baseFrom, 0, 0, 0);

      const endTime = new Date(date);
      endTime.setHours(baseTo, 59, 59, 999);

      while (date.getHours() <= endTime.getHours()) {
        const timeSlot: TimeSlot = {
          date: new Date(date),
          time: new Date(date),
          day: day,
        };
        slots.push(timeSlot);

        date.setMinutes(date.getMinutes() + 15);
      }
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
export function getDateLabels(
  from: Date,
  to: Date,
  eventType: string,
): string[] {
  const labels: string[] = [];
  const range = expandDateRange({ from, to });
  for (const date of range) {
    const weekday = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
    const monthDay = date
      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
      .toUpperCase();
    const string = eventType === "weekday" ? weekday : `${weekday} ${monthDay}`;
    labels.push(string);
  }
  return labels;
}

export function getDateKeys(from: Date, to: Date): string[] {
  const dates = expandDateRange({ from, to });
  return dates.map((d) =>
    d.toLocaleDateString("en-CA", {
      timeZone: "UTC",
    }),
  ); // "YYYY-MM-DD"
}
