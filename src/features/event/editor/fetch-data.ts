import formatApiError from "@/src/lib/utils/api/format-api-error";

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
  const baseUrl = process.env.API_URL;
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
