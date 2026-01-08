import { parseISO } from "date-fns";

import { EventRange } from "@/core/event/types";
import { generateWeekdayMap } from "@/core/event/weekday-utils";
import { EventDetailsResponse } from "@/features/event/editor/fetch-data";

const timeToHour = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + minutes / 60;
};

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

  const startHour = timeToHour(eventData.start_time);
  const endHour = timeToHour(eventData.end_time);

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
        from: startHour,
        to: endHour,
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
        from: startHour,
        to: endHour,
      },
    };
  }

  return { eventName, eventRange, timeslots };
}
