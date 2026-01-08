import { useMemo } from "react";

import { differenceInCalendarDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import { EventRange } from "@/core/event/types";
import { expandEventRange } from "@/features/event/grid/lib/expand-event-range";

export default function useGenerateTimeSlots(
  eventRange: EventRange,
  timezone: string,
) {
  return useMemo(() => {
    const daySlots = expandEventRange(eventRange);
    if (daySlots.length === 0) {
      return {
        timeBlocks: [],
        dayGroupedSlots: [],
        numDays: 0,
        numHours: 0,
        error: "Invalid or missing date range",
      };
    }

    const localStartTime = toZonedTime(daySlots[0].timeslots[0], timezone);
    const localEndTime = toZonedTime(
      daySlots[daySlots.length - 1].timeslots.slice(-1)[0],
      timezone,
    );

    const localStartHour = localStartTime.getHours();
    const localEndHour = localEndTime.getHours();

    const timeBlocks = [];
    let numHours = 0;

    // Handle overnight ranges
    if (localEndHour < localStartHour) {
      timeBlocks.push({ startHour: 0, endHour: localEndHour });
      timeBlocks.push({ startHour: localStartHour, endHour: 23 });
      numHours += localEndHour;
      numHours += 24 - localStartHour;
    } else {
      timeBlocks.push({ startHour: localStartHour, endHour: localEndHour });
      numHours += localEndHour - localStartHour;
    }

    const numDays = differenceInCalendarDays(localEndTime, localStartTime) + 1;

    return { timeBlocks, daySlots, numDays, numHours, error: null };
  }, [eventRange, timezone]);
}
