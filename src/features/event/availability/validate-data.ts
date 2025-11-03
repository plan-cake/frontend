import { AvailabilityState } from "@/core/availability/reducers/reducer";

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
    } catch {
      errors.api = "Could not verify name availability. Please try again.";
    }
  }

  if (!userAvailability || userAvailability.size === 0) {
    errors.availability = "Please select your availability on the grid.";
  }

  return errors;
}
