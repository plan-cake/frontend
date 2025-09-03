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

export type DaySlot = {
  date: Date;
  dayLabel: string;
  dayKey: string;
  timeslots: TimeSlot[];
};

// Combine a date and a time-only object into a full Date object
export function combineDateAndTime(date: Date, time: Date): Date {
  const result = new Date(date);
  result.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return result;
}

/**
 * GENERATE TIME SLOTS
 * timeslots are 15 minutes time intervals generated in UTC time
 */

export function expandEventRange(range: EventRange): DaySlot[] {
  if (range.type === "specific") {
    return generateConcreteInstancesForSpecificRange(range);
  } else if (range.type === "weekday") {
    return generateConcreteInstancesForWeek(range);
  }

  return [];
}

function generateConcreteInstancesForSpecificRange(
  range: SpecificDateRange,
): DaySlot[] {
  const daySlots: DaySlot[] = [];
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
    // get the weekday and month/day labels
    const weekday = current
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
    const monthDay = current
      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
      .toUpperCase();
    const dayKey = current.toLocaleDateString("en-CA", {
      timeZone: "UTC",
    });

    // generate 15-minute time slots
    let slots: TimeSlot[] = [];
    let currentTime = new Date(current);
    currentTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(current);
    endTime.setHours(endHour, 0, 0, 0);
    while (currentTime.getTime() <= endTime.getTime()) {
      const timeSlot: TimeSlot = {
        date: new Date(current),
        time: new Date(currentTime),
        day: `${weekday} ${monthDay}`,
      };
      slots.push(timeSlot);

      currentTime.setMinutes(currentTime.getMinutes() + 15);
    }

    daySlots.push({
      date: new Date(current),
      dayLabel: `${weekday} ${monthDay}`,
      dayKey: dayKey,
      timeslots: slots,
    });
    current.setDate(current.getDate() + 1);
  }

  return daySlots;
}

function generateConcreteInstancesForWeek(range: WeekdayRange): DaySlot[] {
  const daySlots: DaySlot[] = [];

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

      // get the weekday and month/day labels
      const dayKey = date.toLocaleDateString("en-US");
      const weekday = date
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();
      const monthDay = date
        .toLocaleDateString("en-US", { month: "short", day: "numeric" })
        .toUpperCase();

      // generate 15-minute time slots
      let slots: TimeSlot[] = [];

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

      daySlots.push({
        date: new Date(date),
        dayLabel: `${weekday} ${monthDay}`,
        dayKey: dayKey,
        timeslots: slots,
      });
    }
  }

  return daySlots;
}
