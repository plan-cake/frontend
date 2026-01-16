import { useMemo } from "react";

import { differenceInCalendarDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import { EventRange } from "@/core/event/types";

export default function useGenerateTimeSlots(
  eventRange: EventRange,
  timeslots: Date[],
  timezone: string,
) {
  return useMemo(() => {
    if (timeslots.length === 0) {
      return {
        timeBlocks: [],
        dayGroupedSlots: [],
        numDays: 0,
        numHours: 0,
        error: "Invalid or missing date range",
      };
    }

    const localStartTime = toZonedTime(timeslots[0], timezone);
    const localEndTime = toZonedTime(timeslots[timeslots.length - 1], timezone);

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

    const dayGroupedSlots = Array.from(
      timeslots
        .reduce((daysMap, slot) => {
          const zonedDate = toZonedTime(slot, timezone);
          const dayKey = zonedDate.toLocaleDateString("en-CA");

          if (!daysMap.has(dayKey)) {
            let dayLabel = "";
            if (eventRange.type === "weekday") {
              dayLabel = zonedDate
                .toLocaleDateString("en-US", {
                  weekday: "short",
                })
                .toUpperCase() as keyof typeof eventRange.weekdays;
            } else {
              dayLabel = zonedDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
            }
            daysMap.set(dayKey, {
              dayKey,
              dayLabel,
              date: zonedDate,
              timeslots: [],
            });
          }
          daysMap.get(dayKey)!.timeslots.push(slot);
          return daysMap;
        }, new Map())
        .values(),
    );

    const numDays = differenceInCalendarDays(localEndTime, localStartTime) + 1;

    return { timeBlocks, dayGroupedSlots, numDays, numHours, error: null };
  }, [eventRange, timezone, timeslots]);
}
