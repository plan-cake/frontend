import handleErrorResponse from "@/lib/utils/api/handle-api-error";

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
    handleErrorResponse(res.status, await res.json());
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
    // 400 error is expected if the user has not submitted availability yet
    if (res.status !== 400) {
      handleErrorResponse(res.status, await res.json());
    }
  }

  return res.json();
}
