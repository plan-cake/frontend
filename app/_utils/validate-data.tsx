import { EventInformation } from "@/app/_lib/schedule/types";
import { AvailabilityState } from "../_lib/availability/availability-reducer";

export async function validateEventData(
  data: EventInformation,
): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};
  const { title, customCode, eventRange } = data;

  if (!title?.trim()) {
    errors.title = "Please enter an event name.";
  } else if (title.length > 50) {
    errors.title = "Event name must be under 50 characters.";
  }

  if (customCode) {
    try {
      const response = await fetch("/api/event/check-code/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_code: customCode }),
      });
      if (!response.ok) {
        errors.customCode = "This code is unavailable. Please choose another.";
      }
    } catch (error) {
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

export async function validateAvailabilityData(
  data: AvailabilityState,
  eventCode: string,
): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};
  const { displayName, userAvailability } = data;

  if (!displayName?.trim()) {
    errors.displayName = "Please enter your name.";
  } else {
    try {
      const response = await fetch("/api/availability/check-display-name/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_code: eventCode,
          display_name: displayName,
        }),
      });
      if (!response.ok) {
        errors.displayName =
          "This name is already taken. Please choose another.";
      }
    } catch (error) {
      errors.api = "Could not verify name availability. Please try again.";
    }
  }

  if (!userAvailability || userAvailability.size === 0) {
    errors.availability = "Please select your availability on the grid.";
  }

  return errors;
}
