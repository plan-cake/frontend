import { EventCodePageProps } from "@/app/_lib/types/event-code-page-props";
import { fetchEventDetails } from "@/app/_utils/fetch-data";
import { processEventData } from "@/app/_utils/process-event-data";
import EventEditor from "../../ui/layout/event-editor";
import notFound from "../not-found";

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
