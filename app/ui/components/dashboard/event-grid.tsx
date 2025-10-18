import DashboardEvent, { DashboardEventProps } from "./dashboard-event";

export type EventGridProps = DashboardEventProps[];

export default function EventGrid({ events }: { events: EventGridProps }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((data: DashboardEventProps) => (
        <DashboardEvent key={data.event_code} {...data} />
      ))}
    </div>
  );
}
