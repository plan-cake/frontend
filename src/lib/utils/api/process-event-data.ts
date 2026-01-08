import { parseISO } from "date-fns";

import { EventRange } from "@/core/event/types";
import { generateWeekdayMap } from "@/core/event/weekday-utils";
import { EventDetailsResponse } from "@/features/event/editor/fetch-data";

export function processEventData(eventData: EventDetailsResponse): {
  eventName: string;
  eventRange: EventRange;
  timeslots: Date[];
} {
  const eventName: string = eventData.title;
  const timeslots: Date[] = eventData.timeslots.map((ts) => {
    return parseISO(ts + "Z");
  });
  let eventRange: EventRange;

  const startTime = eventData.start_time.substring(0, 5);
  const endTime = eventData.end_time.substring(0, 5);

  if (eventData.event_type === "Date") {
    eventRange = {
      type: "specific",
      duration: eventData.duration || 0,
      timezone: eventData.time_zone,
      dateRange: {
        from: eventData.start_date!,
        to: eventData.end_date!,
      },
      timeRange: {
        from: startTime,
        to: endTime,
      },
    };
  } else {
    const startDayIndex = new Date(eventData.start_date!).getUTCDay();
    const endDayIndex = new Date(eventData.end_date!).getUTCDay();

    const weekdays = generateWeekdayMap(startDayIndex, endDayIndex);

    eventRange = {
      type: "weekday",
      duration: eventData.duration || 0,
      timezone: eventData.time_zone,
      weekdays: weekdays,
      timeRange: {
        from: startTime,
        to: endTime,
      },
    };
  }

  return { eventName, eventRange, timeslots };
}
