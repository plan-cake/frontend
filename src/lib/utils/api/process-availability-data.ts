import { AvailabilityDataResponse } from "@/features/event/availability/fetch-data";
import { formatDateTime } from "@/lib/utils/date-time-format";

export function processAvailabilityData(
  availabilityData: AvailabilityDataResponse,
  eventType: string,
  timezone: string,
): AvailabilityDataResponse {
  const availabilities = availabilityData.availability || {};

  // convert all keys to ISO strings
  const convertedAvailabilities: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(availabilities)) {
    const isoKey = formatDateTime(key, timezone, eventType);
    convertedAvailabilities[isoKey] = value;
  }

  return {
    ...availabilityData,
    availability: convertedAvailabilities,
  };
}
