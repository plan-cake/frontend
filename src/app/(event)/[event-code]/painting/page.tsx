import { Metadata } from "next";
import { notFound } from "next/navigation";

import ClientPage from "@/app/(event)/[event-code]/painting/page-client";
import { fetchSelfAvailability } from "@/features/event/availability/fetch-data";
import { EventCodePageProps } from "@/features/event/code-page-props";
import { fetchEventDetails } from "@/features/event/editor/fetch-data";
import { getAuthCookieString } from "@/lib/utils/api/cookie-utils";
import { processEventData } from "@/lib/utils/api/process-event-data";

export async function generateMetadata({
  params,
}: EventCodePageProps): Promise<Metadata> {
  const { "event-code": eventCode } = await params;
  const authCookies = await getAuthCookieString();

  const initialEventData = await fetchEventDetails(eventCode, authCookies);

  if (!initialEventData) {
    return {
      title: "Event Not Found",
    };
  }

  const { eventName } = processEventData(initialEventData);

  return {
    title: `${eventName} • Plancake`,
    openGraph: {
      title: eventName,
      description: `Add your availability for ${eventName}`,
    },
  };
}

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
  const { eventName, eventRange, timeslots } = processEventData(eventData);

  return (
    <ClientPage
      eventCode={eventCode}
      eventName={eventName}
      eventRange={eventRange}
      timeslots={timeslots}
      initialData={initialAvailabilityData}
    />
  );
}
