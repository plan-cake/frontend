import handleErrorResponse from "@/lib/utils/api/handle-api-error";

export type DashboardEventResponse = {
  title: string;
  duration?: number;
  start_time: string;
  end_time: string;
  time_zone: string;
  event_type: "Date" | "Week";
  start_date?: string;
  end_date?: string;
  participants: string[];
  event_code: string;
};

export type DashboardResponse = {
  created_events: DashboardEventResponse[];
  participated_events: DashboardEventResponse[];
};

export async function fetchDashboard(
  cookieHeader: string,
): Promise<DashboardResponse> {
  const baseUrl = process.env.API_URL;
  const res = await fetch(`${baseUrl}/dashboard/get`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    handleErrorResponse(res.status, await res.json());
  }

  return res.json();
}
