import { cache } from "react";

import handleErrorResponse from "@/lib/utils/api/handle-api-error";

export type EventDetailsResponse = {
  title: string;
  duration?: number;
  time_zone: string;
  timeslots: string[];
  is_creator: boolean;
  event_type: "Date" | "Week";
  start_date?: string;
  end_date?: string;
  start_time: string;
  end_time: string;
};

export const getCachedEventDetails = cache(
  async (eventCode: string, cookieHeader?: string) => {
    return await fetchEventDetails(eventCode, cookieHeader);
  },
);

async function fetchEventDetails(
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
    handleErrorResponse(res.status, await res.json());
  }

  return res.json();
}
