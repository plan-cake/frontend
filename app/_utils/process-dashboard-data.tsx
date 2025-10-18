import { DashboardEventProps } from "../ui/components/dashboard/dashboard-event";
import { DashboardPageProps } from "../ui/layout/dashboard-page";

function processSingleEvent(eventData: any): DashboardEventProps {
  if (eventData.event_type === "Date") {
    const data: DashboardEventProps = {
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

export function processDashboardData(eventData: any): DashboardPageProps {
  const processedEvents = {
    created_events: [] as DashboardEventProps[],
    participated_events: [] as DashboardEventProps[],
  };

  for (const event of eventData.created_events) {
    processedEvents.created_events.push(processSingleEvent(event));
  }

  for (const event of eventData.participated_events) {
    processedEvents.participated_events.push(processSingleEvent(event));
  }

  return processedEvents;
}
