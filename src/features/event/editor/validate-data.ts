import { DateRange } from "react-day-picker";

import { EventInformation, WeekdayRange } from "@/core/event/types";
import { findRangeFromWeekdayMap } from "@/core/event/weekday-utils";
import { EventEditorType } from "@/features/event/editor/types";

export async function validateEventData(
  editorType: EventEditorType,
  data: EventInformation,
): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};
  const { title, eventRange } = data;

  // Validate title
  if (!title?.trim()) {
    errors.title = "Please enter an event name.";
  } else if (title.length > 50) {
    errors.title = "Event name must be under 50 characters.";
  }

  // Validate event range
  if (eventRange.type === "specific") {
    if (!eventRange.dateRange?.from || !eventRange.dateRange?.to) {
      errors.dateRange = "Please select a valid date range.";
    } else {
      // check if the date range is more than 30 days
      const fromDate = new Date(eventRange.dateRange.from);
      const toDate = new Date(eventRange.dateRange.to);
      if (toDate.getTime() - fromDate.getTime() > 30 * 24 * 60 * 60 * 1000) {
        errors.dateRange = "Too many days selected. Max is 30 days.";
      }
    }
  }

  if (eventRange.type === "weekday") {
    const weekdayRange = findRangeFromWeekdayMap(
      (data.eventRange as WeekdayRange).weekdays,
    );
    if (weekdayRange.startDay === null || weekdayRange.endDay === null) {
      errors.weekdayRange = "Please select at least one weekday.";
    }
  }

  // Validate time range
  if (eventRange.timeRange.from >= eventRange.timeRange.to) {
    errors.timeRange = "Please select a valid time range.";
  }

  return errors;
}

export function checkInvalidDateRangeLength(
  range: DateRange | undefined,
): boolean {
  if (range?.from && range?.to) {
    const diffTime = range.to.getTime() - range.from.getTime();
    return diffTime > 30 * 24 * 60 * 60 * 1000; // more than 30 days
  }
  return false;
}
