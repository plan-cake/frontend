import { notFound } from "next/navigation";
import { fetchAvailabilityData } from "@/features/event/availability/fetch-data";
import { fetchEventDetails } from "@/features/event/editor/fetch-data";
import { processEventData } from "@/lib/utils/api/process-event-data";

import ClientPage from "@/app/(event)/[event-code]/page-client";
import { getAuthCookieString } from "@/lib/utils/api/cookie-utils";
import { EventCodePageProps } from "@/features/event/code-page-props";

export default async function Page({ params }: EventCodePageProps) {
  const { "event-code": eventCode } = await params;
  const authCookies = await getAuthCookieString();

  if (!eventCode) {
    notFound();
  }

  const [initialEventData, availabilityData] = await Promise.all([
    fetchEventDetails(eventCode, authCookies),
    fetchAvailabilityData(eventCode, authCookies),
  ]);

  // Process the data here, on the server!
  const { eventName, eventRange } = processEventData(initialEventData);

  return (
    <ClientPage
      eventCode={eventCode}
      eventName={eventName} // Pass the processed name
      eventRange={eventRange} // Pass the processed range
      initialAvailabilityData={availabilityData}
    />
  );
}
