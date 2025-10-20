import formatApiError from "@/app/_utils/format-api-error";

export type EventDetailsResponse = {
  title: string;
  duration?: number;
  start_hour: number;
  end_hour: number;
  time_zone: string;
  event_type: "Date" | "Week";
  start_date?: string;
  end_date?: string;
  start_weekday?: number;
  end_weekday?: number;
};

export async function fetchEventDetails(
  eventCode: string,
  cookieHeader?: string,
): Promise<EventDetailsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(
    `${baseUrl}/event/get-details/?event_code=${eventCode}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader ? cookieHeader : "",
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorMessage = formatApiError(await res.json());
    throw new Error("Failed to fetch event details: " + errorMessage);
  }

  return res.json();
}

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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
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

export type DashboardEventResponse = {
  title: string;
  duration?: number;
  start_hour: number;
  end_hour: number;
  time_zone: string;
  event_type: "Date" | "Week";
  start_date?: string;
  end_date?: string;
  start_weekday?: number;
  end_weekday?: number;
  event_code: string;
};

export type DashboardResponse = {
  created_events: DashboardEventResponse[];
  participated_events: DashboardEventResponse[];
};

export async function fetchDashboard(
  cookieHeader: string,
): Promise<DashboardResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${baseUrl}/dashboard/get`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorMessage = formatApiError(await res.json());
    throw new Error("Failed to fetch dashboard events: " + errorMessage);
  }

  return res.json();
}
