import { generateWeekdayMap } from "@/src/core/event/weekday-utils";
import { EventRange } from "@/src/core/event/types";
import { EventDetailsResponse } from "@/src/features/event/editor/fetch-data";

export function processEventData(eventData: EventDetailsResponse): {
  eventName: string;
  eventRange: EventRange;
} {
  const eventName: string = eventData.title;
  let eventRange: EventRange;

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
        from: eventData.start_hour,
        to: eventData.end_hour,
      },
    };
  } else {
    const weekdays = generateWeekdayMap(
      eventData.start_weekday!,
      eventData.end_weekday!,
    );
    eventRange = {
      type: "weekday",
      duration: eventData.duration || 0,
      timezone: eventData.time_zone,
      weekdays: weekdays,
      timeRange: {
        from: eventData.start_hour,
        to: eventData.end_hour,
      },
    };
  }

  return { eventName, eventRange };
}
