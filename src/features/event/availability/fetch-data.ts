import formatApiError from "@/src/lib/utils/api/format-api-error";

export type AvailabilityDataResponse = {
  is_creator: boolean;
  user_display_name: string | null;
  participants: string[];
  availability: Record<string, string[]>;
};

export async function fetchAvailabilityData(
  eventCode: string,
  cookieHeader: string,
): Promise<AvailabilityDataResponse> {
  const baseUrl = process.env.API_URL;
  const res = await fetch(
    `${baseUrl}/availability/get-all/?event_code=${eventCode}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorMessage = formatApiError(await res.json());
    throw new Error("Failed to fetch availability data: " + errorMessage);
  }

  return res.json();
}

export type SelfAvailabilityResponse = {
  display_name: string | null;
  time_zone: string;
  available_dates: string[];
};

export async function fetchSelfAvailability(
  eventCode: string,
  cookieHeader: string,
): Promise<SelfAvailabilityResponse | null> {
  const baseUrl = process.env.API_URL;
  const res = await fetch(
    `${baseUrl}/availability/get-self/?event_code=${eventCode}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}
