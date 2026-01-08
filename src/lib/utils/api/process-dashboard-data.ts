import { DashboardPageProps } from "@/app/dashboard/page-client";
import { DashboardEventProps } from "@/features/dashboard/components/event";
import {
  DashboardEventResponse,
  DashboardResponse,
} from "@/features/dashboard/fetch-data";

const timeToHour = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + minutes / 60;
};

function processSingleEvent(
  myEvent: boolean,
  eventData: DashboardEventResponse,
): DashboardEventProps {
  const startHour = timeToHour(eventData.start_time);
  const endHour = timeToHour(eventData.end_time);

  if (eventData.event_type === "Date") {
    const data: DashboardEventProps = {
      myEvent: myEvent,
      code: eventData.event_code,
      title: eventData.title,
      type: "specific",
      startHour: startHour,
      endHour: endHour,
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
      startHour: startHour,
      endHour: endHour,
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
