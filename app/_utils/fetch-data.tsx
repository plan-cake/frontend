import formatApiError from "@/app/_utils/format-api-error";

export async function fetchEventDetails(
  eventCode: string,
  cookieHeader?: string,
): Promise<any> {
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

export async function fetchAvailabilityData(
  eventCode: string,
  cookieHeader: string,
): Promise<any> {
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
