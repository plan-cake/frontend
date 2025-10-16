import { notFound } from "next/navigation";
import {
  fetchEventDetails,
  fetchAvailabilityData,
} from "@/app/_utils/fetch-data";
import { processEventData } from "@/app/_utils/process-event-data";

import ResultsPage from "@/app/ui/layout/results-page";
import { getAuthCookieString } from "@/app/_utils/cookie-utils";

export default async function Page({
  params,
}: {
  params: { "event-code": string };
}) {
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
    <ResultsPage
      eventCode={eventCode}
      eventName={eventName} // Pass the processed name
      eventRange={eventRange} // Pass the processed range
      initialAvailabilityData={availabilityData}
    />
  );
}
