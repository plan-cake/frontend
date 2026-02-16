import DashboardEvent, {
  DashboardEventProps,
} from "@/features/dashboard/components/event";

export type EventGridProps = DashboardEventProps[];

export default function EventGrid({ events }: { events: EventGridProps }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {events.map((data: DashboardEventProps) => (
        <DashboardEvent key={data.code} {...data} />
      ))}
    </div>
  );
}
