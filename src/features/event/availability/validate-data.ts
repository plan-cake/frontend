import { AvailabilityState } from "@/core/availability/reducers/reducer";

export async function validateAvailabilityData(
  data: AvailabilityState,
): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};
  const { displayName, userAvailability } = data;

  if (!displayName?.trim()) {
    errors.displayName = "Please enter your name.";
  }

  if (!userAvailability || userAvailability.size === 0) {
    errors.availability = "Please select your availability on the grid.";
  }

  return errors;
}
