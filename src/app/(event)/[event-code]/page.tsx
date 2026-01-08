import { notFound } from "next/navigation";

import ClientPage from "@/app/(event)/[event-code]/page-client";
import { fetchAvailabilityData } from "@/features/event/availability/fetch-data";
import { EventCodePageProps } from "@/features/event/code-page-props";
import { fetchEventDetails } from "@/features/event/editor/fetch-data";
import { getAuthCookieString } from "@/lib/utils/api/cookie-utils";
import { processEventData } from "@/lib/utils/api/process-event-data";

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

  const { eventName, eventRange, timeslots, isCreator } =
    processEventData(initialEventData);

  return (
    <ClientPage
      eventCode={eventCode}
      eventName={eventName}
      eventRange={eventRange}
      timeslots={timeslots}
      initialAvailabilityData={availabilityData}
      isCreator={isCreator}
    />
  );
}
