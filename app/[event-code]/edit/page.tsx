import EventEditor from "../../ui/layout/event-editor";

export default async function Page({
  params,
}: {
  params: { "event-code": string };
}) {
  const { "event-code": eventCode } = await params;
  return <EventEditor type="edit" eventCode={eventCode} />;
}
