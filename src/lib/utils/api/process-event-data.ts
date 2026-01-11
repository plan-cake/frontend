import { EventRange } from "@/core/event/types";
import { generateWeekdayMap } from "@/core/event/weekday-utils";
import { EventDetailsResponse } from "@/features/event/editor/fetch-data";
import {
  getZonedDetails,
  parseIsoDateTime,
} from "@/lib/utils/date-time-format";

export function processEventData(eventData: EventDetailsResponse): {
  eventName: string;
  eventRange: EventRange;
  timeslots: Date[];
  isCreator: boolean;
} {
  const eventName: string = eventData.title;
  const timeslots: Date[] = eventData.timeslots.map((ts) => {
    return parseIsoDateTime(ts);
  });
  let eventRange: EventRange;

  const start = getZonedDetails(
    eventData.start_time,
    eventData.start_date!,
    eventData.time_zone,
  );

  const end = getZonedDetails(
    eventData.end_time,
    eventData.end_date!,
    eventData.time_zone,
  );

  if (eventData.event_type === "Date") {
    eventRange = {
      type: "specific",
      duration: eventData.duration || 0,
      timezone: eventData.time_zone,
      dateRange: {
        from: start.date,
        to: end.date,
      },
      timeRange: {
        from: start.time,
        to: end.time,
      },
    };
  } else {
    const weekdays = generateWeekdayMap(start.weekday, end.weekday);
    eventRange = {
      type: "weekday",
      duration: eventData.duration || 0,
      timezone: eventData.time_zone,
      weekdays: weekdays,
      timeRange: {
        from: start.time,
        to: end.time,
      },
    };
  }

  return { eventName, eventRange, timeslots, isCreator: eventData.is_creator };
}
