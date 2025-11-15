import { AvailabilityState } from "@/core/availability/reducers/reducer";
import { MESSAGES } from "@/lib/messages";

export async function validateAvailabilityData(
  data: AvailabilityState,
): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};
  const { displayName, userAvailability } = data;

  if (!displayName?.trim()) {
    errors.displayName = MESSAGES.ERROR_NAME_MISSING;
  }

  if (!userAvailability || userAvailability.size === 0) {
    errors.availability = MESSAGES.ERROR_AVAILABILITY_MISSING;
  }

  return errors;
}
