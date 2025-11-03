import {
  EventRange,
  SpecificDateRange,
  WeekdayRange,
} from "@/core/event/types";
import { findRangeFromWeekdayMap } from "@/core/event/weekday-utils";
import { EventEditorType } from "@/features/event/editor/types";
import { formatApiError } from "@/lib/utils/api/handle-api-error";

export type EventSubmitData = {
  title: string;
  code: string;
  eventRange: EventRange;
};

type EventSubmitJsonBody = {
  title: string;
  duration?: number;
  time_zone: string;
  start_hour: number;
  end_hour: number;
  start_date?: string;
  end_date?: string;
  start_weekday?: number;
  end_weekday?: number;
  custom_code?: string;
  event_code?: string;
};

const formatDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default async function submitEvent(
  data: EventSubmitData,
  type: EventEditorType,
  eventType: "specific" | "weekday",
  onSuccess: (code: string) => void,
): Promise<boolean> {
  let apiRoute = "";
  let jsonBody: EventSubmitJsonBody;

  if (eventType === "specific") {
    apiRoute =
      type === "new" ? "/api/event/date-create/" : "/api/event/date-edit/";

    // check if the date range is more than 30 days
    const fromDate = new Date(
      (data.eventRange as SpecificDateRange).dateRange.from,
    );
    const toDate = new Date(
      (data.eventRange as SpecificDateRange).dateRange.to,
    );
    if (toDate.getTime() - fromDate.getTime() > 30 * 24 * 60 * 60 * 1000) {
      alert("Too many days selected. Max is 30 days.");
      return false;
    }

    jsonBody = {
      title: data.title,
      time_zone: data.eventRange.timezone,
      start_date: formatDate(
        new Date((data.eventRange as SpecificDateRange).dateRange.from),
      ),
      end_date: formatDate(
        new Date((data.eventRange as SpecificDateRange).dateRange.to),
      ),
      start_hour: data.eventRange.timeRange.from,
      end_hour: data.eventRange.timeRange.to,
    };
  } else {
    apiRoute =
      type === "new" ? "/api/event/week-create/" : "/api/event/week-edit/";

    const weekdayRange = findRangeFromWeekdayMap(
      (data.eventRange as WeekdayRange).weekdays,
    );
    if (weekdayRange.startDay === null || weekdayRange.endDay === null) {
      alert("Please select at least one weekday.");
      return false;
    }

    const dayNameToIndex: { [key: string]: number } = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    jsonBody = {
      title: data.title,
      time_zone: data.eventRange.timezone,
      start_weekday: dayNameToIndex[weekdayRange.startDay!],
      end_weekday: dayNameToIndex[weekdayRange.endDay!],
      start_hour: data.eventRange.timeRange.from,
      end_hour: data.eventRange.timeRange.to,
    };
  }

  // only include duration if set
  if (data.eventRange.duration && data.eventRange.duration > 0) {
    jsonBody.duration = data.eventRange.duration;
  }

  if (type === "new" && data.code) {
    jsonBody.custom_code = data.code;
  } else if (type === "edit") {
    jsonBody.event_code = data.code;
  }

  try {

    const res = await fetch(apiRoute, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonBody),
    });
    if (res.ok) {
      const code = (await res.json()).event_code;
      if (type === "new") {
        onSuccess(code);
        return true;
      } else {
        // endpoint does not return code on edit
        onSuccess(data.code);
        return true;
      }
    } else {
      alert(formatApiError(await res.json()));
      return false;
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("An error occurred. Please try again.");
    return false;
  }
}
