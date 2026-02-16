import { Metadata } from "next";
import { notFound } from "next/navigation";

import ClientPage from "@/app/(event)/[event-code]/painting/page-client";
import { fetchSelfAvailability } from "@/features/event/availability/fetch-data";
import { EventCodePageProps } from "@/features/event/code-page-props";
import { getCachedEventDetails } from "@/features/event/editor/fetch-data";
import { getAuthCookieString } from "@/lib/utils/api/cookie-utils";
import { processEventData } from "@/lib/utils/api/process-event-data";
import { constructMetadata } from "@/lib/utils/construct-metadata";

export async function generateMetadata({
  params,
}: EventCodePageProps): Promise<Metadata> {
  const { "event-code": eventCode } = await params;

  const initialEventData = await getCachedEventDetails(eventCode);

  if (!initialEventData) {
    return constructMetadata(
      "Event Not Found",
      "The event you are looking for could not be found.",
    );
  }

  const { eventName } = processEventData(initialEventData);

  return constructMetadata(
    eventName,
    "Add your availability for this event and let others know when you're free!",
  );
}

export default async function Page({ params }: EventCodePageProps) {
  const { "event-code": eventCode } = await params;
  const authCookies = await getAuthCookieString();

  if (!eventCode) {
    notFound();
  }

  const [eventData, initialAvailabilityData] = await Promise.all([
    getCachedEventDetails(eventCode),
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
