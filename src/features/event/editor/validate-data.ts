import { DateRange } from "react-day-picker";

import { EventInformation } from "@/core/event/types";

export async function validateEventData(
  editorType: EventEditorType,
  data: EventInformation,
): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};
  const { title, customCode, eventRange } = data;

  if (!title?.trim()) {
    errors.title = "Please enter an event name.";
  } else if (title.length > 50) {
    errors.title = "Event name must be under 50 characters.";
  }

  if (editorType === "new" && customCode) {
    try {
      const response = await fetch("/api/event/check-code/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_code: customCode }),
      });
      if (!response.ok) {
        errors.customCode = "This code is unavailable. Please choose another.";
      }
    } catch {
      errors.api = "Could not verify the custom code. Please try again.";
    }
  }

  if (
    eventRange.type === "specific" &&
    (!eventRange.dateRange?.from || !eventRange.dateRange?.to)
  ) {
    errors.dateRange = "Please select a valid date range.";
  }

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
