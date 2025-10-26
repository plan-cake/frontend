import { EventCodePageProps } from "@/features/event/code-page-props";
import { fetchEventDetails } from "@/features/event/editor/fetch-data";
import { processEventData } from "@/lib/utils/api/process-event-data";
import EventEditor from "@/features/event/editor/editor";
import notFound from "@/app/not-found";

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
