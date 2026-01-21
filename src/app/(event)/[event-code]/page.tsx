import { Metadata } from "next";
import { notFound } from "next/navigation";

import ClientPage from "@/app/(event)/[event-code]/page-client";
import { fetchAvailabilityData } from "@/features/event/availability/fetch-data";
import { EventCodePageProps } from "@/features/event/code-page-props";
import { getCachedEventDetails } from "@/features/event/editor/fetch-data";
import { getAuthCookieString } from "@/lib/utils/api/cookie-utils";
import { processAvailabilityData } from "@/lib/utils/api/process-availability-data";
import { processEventData } from "@/lib/utils/api/process-event-data";

export async function generateMetadata({
  params,
}: EventCodePageProps): Promise<Metadata> {
  const { "event-code": eventCode } = await params;
  const authCookies = await getAuthCookieString();

  const initialEventData = await getCachedEventDetails(eventCode, authCookies);

  if (!initialEventData) {
    return {
      title: "Event Not Found • Plancake",
    };
  }

  const { eventName } = processEventData(initialEventData);

  return {
    title: `${eventName} • Plancake`,
    openGraph: {
      title: `${eventName} • Plancake`,
      description:
        "View event details and add your availability for this event.",
    },
  };
}

export default async function Page({ params }: EventCodePageProps) {
  const { "event-code": eventCode } = await params;
  const authCookies = await getAuthCookieString();

  if (!eventCode) {
    notFound();
  }

  const [initialEventData, initialAvailabilityData] = await Promise.all([
    getCachedEventDetails(eventCode, authCookies),
    fetchAvailabilityData(eventCode, authCookies),
  ]);

  const { eventName, eventRange, timeslots, isCreator } =
    processEventData(initialEventData);

  const availabilityData = processAvailabilityData(
    initialAvailabilityData,
    eventRange.type,
    eventRange.timezone,
  );

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
