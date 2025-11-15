import { DateRange } from "react-day-picker";

import { EventInformation, WeekdayRange } from "@/core/event/types";
import { findRangeFromWeekdayMap } from "@/core/event/weekday-utils";
import { EventEditorType } from "@/features/event/editor/types";
import { isDurationExceedingMax } from "@/features/event/max-event-duration";
import { MESSAGES } from "@/lib/messages";

export async function validateEventData(
  editorType: EventEditorType,
  data: EventInformation,
): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};
  const { title, eventRange } = data;

  // Validate title
  if (!title?.trim()) {
    errors.title = MESSAGES.ERROR_EVENT_NAME_MISSING;
  } else if (title.length > 50) {
    errors.title = MESSAGES.ERROR_EVENT_NAME_LENGTH;
  }

  // Validate event range
  if (eventRange.type === "specific") {
    if (!eventRange.dateRange?.from || !eventRange.dateRange?.to) {
      errors.dateRange = MESSAGES.ERROR_EVENT_RANGE_INVALID;
    } else {
      // check if the date range is more than 30 days
      const fromDate = new Date(eventRange.dateRange.from);
      const toDate = new Date(eventRange.dateRange.to);
      if (isDurationExceedingMax(fromDate, toDate)) {
        errors.dateRange = MESSAGES.ERROR_EVENT_RANGE_TOO_LONG;
      }
    }
  }

  if (eventRange.type === "weekday") {
    const weekdayRange = findRangeFromWeekdayMap(
      (data.eventRange as WeekdayRange).weekdays,
    );
    if (weekdayRange.startDay === null || weekdayRange.endDay === null) {
      errors.weekdayRange = MESSAGES.ERROR_EVENT_RANGE_INVALID;
    }
  }

  // Validate time range
  if (eventRange.timeRange.from >= eventRange.timeRange.to) {
    errors.timeRange = MESSAGES.ERROR_EVENT_RANGE_INVALID;
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
