import { Metadata } from "next";
import { notFound } from "next/navigation";

import { EventCodePageProps } from "@/features/event/code-page-props";
import EventEditor from "@/features/event/editor/editor";
import { getCachedEventDetails } from "@/features/event/editor/fetch-data";
import { processEventData } from "@/lib/utils/api/process-event-data";

export async function generateMetadata({
  params,
}: EventCodePageProps): Promise<Metadata> {
  const { "event-code": eventCode } = await params;

  const initialEventData = await getCachedEventDetails(eventCode);

  if (!initialEventData) {
    return {
      title: "Event Not Found • Plancake",
    };
  }

  const { eventName } = processEventData(initialEventData);

  return {
    title: `Editing ${eventName} • Plancake`,
    openGraph: {
      title: `Editing ${eventName}`,
      description: `Editing ${eventName}`,
    },
  };
}

export default async function Page({ params }: EventCodePageProps) {
  const { "event-code": eventCode } = await params;

  if (!eventCode) {
    notFound();
  }

  const eventData = await getCachedEventDetails(eventCode);
  const { eventName, eventRange, timeslots } = processEventData(eventData);

  return (
    <EventEditor
      type="edit"
      initialData={{
        title: eventName,
        customCode: eventCode,
        eventRange,
        timeslots,
      }}
    />
  );
}
