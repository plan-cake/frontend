import { notFound } from "next/navigation";
import { fetchEventDetails, fetchSelfAvailability } from "../_utils/fetch-data";
import { processEventData } from "../_utils/process-event-data";

import AvailabilityClientPage from "@/app/ui/layout/availability-page";
import { EventCodePageProps } from "../_lib/types/event-code-page-props";
import { getAuthCookieString } from "../_utils/cookie-utils";

export default async function Page({ params }: EventCodePageProps) {
  const { "event-code": eventCode } = await params;
  const authCookies = await getAuthCookieString();

  if (!eventCode) {
    notFound();
  }

  const [eventData, initialAvailabilityData] = await Promise.all([
    fetchEventDetails(eventCode),
    fetchSelfAvailability(eventCode, authCookies),
  ]);
  const { eventName, eventRange } = processEventData(eventData);

  return (
    <AvailabilityClientPage
      eventCode={eventCode}
      eventName={eventName}
      eventRange={eventRange}
      initialData={initialAvailabilityData}
    />
  );
}
