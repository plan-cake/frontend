import { notFound } from "next/navigation";
import formatApiError from "@/app/_utils/format-api-error";

import ResultsPage from "@/app/ui/layout/results-page";

async function fetchEventDetails(eventCode: string): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(
    `${baseUrl}/event/get-details/?event_code=${eventCode}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorMessage = formatApiError(await res.json());
    throw new Error("Failed to fetch event details: " + errorMessage);
    // notFound();
  }

  return res.json();
}

async function fetchAvailabilityData(eventCode: string): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(
    `${baseUrl}/availability/get-all/?event_code=${eventCode}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorMessage = formatApiError(await res.json());
    throw new Error("Failed to fetch availability data: " + errorMessage);
  }

  return res.json();
}

export default async function Page({
  params,
}: {
  params: { "event-code": string };
}) {
  const { "event-code": eventCode } = await params;

  if (!eventCode) {
    notFound();
  }

  const eventData = await fetchEventDetails(eventCode);
  const availabilityData = await fetchAvailabilityData(eventCode);

  return (
    <ResultsPage
      eventCode={eventCode}
      initialEventData={eventData}
      initialAvailabilityData={availabilityData}
    />
  );
}
