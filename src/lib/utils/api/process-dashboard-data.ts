import { DashboardPageProps } from "@/app/dashboard/page-client";
import { DashboardEventProps } from "@/features/dashboard/components/event";
import {
  DashboardEventResponse,
  DashboardResponse,
} from "@/features/dashboard/fetch-data";
import { formatApiTime } from "@/lib/utils/date-time-format";

function processSingleEvent(
  myEvent: boolean,
  eventData: DashboardEventResponse,
): DashboardEventProps {
  const startTime = formatApiTime(eventData.start_time, eventData.time_zone);
  const endTime = formatApiTime(eventData.end_time, eventData.time_zone);

  if (eventData.event_type === "Date") {
    const data: DashboardEventProps = {
      myEvent: myEvent,
      code: eventData.event_code,
      title: eventData.title,
      type: "specific",
      startTime: startTime,
      endTime: endTime,
      startDate: eventData.start_date,
      endDate: eventData.end_date,
    };
    return data;
  } else {
    const startWeekday = new Date(eventData.start_date!).getUTCDay();
    const endWeekday = new Date(eventData.end_date!).getUTCDay();

    const data: DashboardEventProps = {
      myEvent: myEvent,
      code: eventData.event_code,
      title: eventData.title,
      type: "weekday",
      startTime: startTime,
      endTime: endTime,
      startWeekday: startWeekday,
      endWeekday: endWeekday,
    };
    return data;
  }
}

export function processDashboardData(
  eventData: DashboardResponse,
): DashboardPageProps {
  const processedEvents = {
    created_events: [] as DashboardEventProps[],
    participated_events: [] as DashboardEventProps[],
  };

  for (const event of eventData.created_events) {
    processedEvents.created_events.push(processSingleEvent(true, event));
  }

  for (const event of eventData.participated_events) {
    processedEvents.participated_events.push(processSingleEvent(false, event));
  }

  return processedEvents;
}
