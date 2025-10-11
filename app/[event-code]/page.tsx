import { notFound } from "next/navigation";
import formatApiError from "../_utils/format-api-error";

import AvailabilityClientPage from "@/app/ui/layout/availability-page";

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

export default async function Page({
  params,
}: {
  params: { "event-code": string };
}) {
  const { "event-code": eventCode } = await params;

  if (!eventCode) {
    notFound();
  }

  console.log(eventCode);

  const eventData = await fetchEventDetails(eventCode);

  return (
    <AvailabilityClientPage
      eventCode={eventCode}
      initialEventData={eventData}
    />
  );
}
