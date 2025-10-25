import { EventCodePageProps } from "@/src/features/event/code-page-props";
import { fetchEventDetails } from "@/src/features/event/editor/fetch-data";
import { processEventData } from "@/src/lib/utils/api/process-event-data";
import EventEditor from "@/src/features/event/editor/editor";
import notFound from "@/src/app/not-found";

export default async function Page({ params }: EventCodePageProps) {
  const { "event-code": eventCode } = await params;

  if (!eventCode) {
    notFound();
  }

  const eventData = await fetchEventDetails(eventCode);
  const { eventName, eventRange } = processEventData(eventData);

  return (
    <EventEditor
      type="edit"
      initialData={{ title: eventName, code: eventCode, eventRange }}
    />
  );
}
