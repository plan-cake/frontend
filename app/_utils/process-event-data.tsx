import { generateWeekdayMap } from "@/app/_lib/schedule/utils";
import { EventRange } from "../_lib/schedule/types";

export function processEventData(eventData: any): {
  eventName: string;
  eventRange: EventRange;
} {
  const eventName: string = eventData.title;
  let eventRange: EventRange;

  if (eventData.event_type === "Date") {
    eventRange = {
      type: "specific",
      duration: eventData.duration,
      timezone: eventData.time_zone,
      dateRange: {
        from: eventData.start_date,
        to: eventData.end_date,
      },
      timeRange: {
        from: eventData.start_hour,
        to: eventData.end_hour,
      },
    };
  } else {
    const weekdays = generateWeekdayMap(
      eventData.start_weekday,
      eventData.end_weekday,
    );
    eventRange = {
      type: "weekday",
      duration: eventData.duration,
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
