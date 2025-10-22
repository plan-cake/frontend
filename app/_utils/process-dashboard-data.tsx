import {
  DashboardEventResponse,
  DashboardResponse,
} from "@/app/_utils/fetch-data";
import { DashboardEventProps } from "@/app/ui/components/dashboard/dashboard-event";
import { DashboardPageProps } from "@/app/ui/layout/dashboard-page";

function processSingleEvent(
  myEvent: boolean,
  eventData: DashboardEventResponse,
): DashboardEventProps {
  if (eventData.event_type === "Date") {
    const data: DashboardEventProps = {
      myEvent: myEvent,
      code: eventData.event_code,
      title: eventData.title,
      type: "specific",
      startHour: eventData.start_hour,
      endHour: eventData.end_hour,
      startDate: eventData.start_date,
      endDate: eventData.end_date,
    };
    return data;
  } else {
    const data: DashboardEventProps = {
      myEvent: myEvent,
      code: eventData.event_code,
      title: eventData.title,
      type: "weekday",
      startHour: eventData.start_hour,
      endHour: eventData.end_hour,
      startWeekday: eventData.start_weekday,
      endWeekday: eventData.end_weekday,
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
