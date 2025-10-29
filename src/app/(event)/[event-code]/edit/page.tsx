import notFound from "@/app/not-found";
import { EventCodePageProps } from "@/features/event/code-page-props";
import EventEditor from "@/features/event/editor/editor";
import { fetchEventDetails } from "@/features/event/editor/fetch-data";
import { processEventData } from "@/lib/utils/api/process-event-data";

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
