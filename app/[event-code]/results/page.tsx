import { notFound } from "next/navigation";
import {
  fetchEventDetails,
  fetchAvailabilityData,
} from "@/app/_utils/fetch-data";
import { processEventData } from "@/app/_utils/process-event-data";

import ResultsPage from "@/app/ui/layout/results-page";

export default async function Page({
  params,
}: {
  params: { "event-code": string };
}) {
  const { "event-code": eventCode } = await params;

  if (!eventCode) {
    notFound();
  }

  const [initialEventData, availabilityData] = await Promise.all([
    fetchEventDetails(eventCode),
    fetchAvailabilityData(eventCode),
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
