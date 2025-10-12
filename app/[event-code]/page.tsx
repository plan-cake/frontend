import { notFound } from "next/navigation";
import { fetchEventDetails } from "../_utils/fetch-data";
import { processEventData } from "../_utils/process-event-data";

import AvailabilityClientPage from "@/app/ui/layout/availability-page";

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
  const { eventName, eventRange } = processEventData(eventData);

  return (
    <AvailabilityClientPage
      eventCode={eventCode}
      eventName={eventName}
      eventRange={eventRange}
    />
  );
}
