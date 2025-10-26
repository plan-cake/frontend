import { notFound } from "next/navigation";
import { fetchSelfAvailability } from "@/features/event/availability/fetch-data";
import { fetchEventDetails } from "@/features/event/editor/fetch-data";
import { processEventData } from "@/lib/utils/api/process-event-data";

import ClientPage from "@/app/(event)/[event-code]/painting/page-client";
import { EventCodePageProps } from "@/features/event/code-page-props";
import { getAuthCookieString } from "@/lib/utils/api/cookie-utils";

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
    <ClientPage
      eventCode={eventCode}
      eventName={eventName}
      eventRange={eventRange}
      initialData={initialAvailabilityData}
    />
  );
}
