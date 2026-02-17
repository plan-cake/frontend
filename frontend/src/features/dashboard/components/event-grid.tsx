"use client";
import { useRef, useState } from "react";

import DashboardEvent, {
  DashboardEventProps,
} from "@/features/dashboard/components/event";
import { ConfirmationDialog } from "@/features/system-feedback";

export type EventGridProps = DashboardEventProps[];

export default function EventGrid({ events }: { events: EventGridProps }) {
  const [eventList, setEventList] = useState(events);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const eventToDelete = useRef<string | null>(null);

  const removeEvent = async () => {
    // Immediate UI update
    setEventList((prev) =>
      prev.filter((e) => e.code !== eventToDelete.current),
    );

    // API call
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/delete/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ event_code: eventToDelete.current }),
      });

      eventToDelete.current = null;
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {eventList.map((data: DashboardEventProps) => {
          const onDelete = data.myEvent
            ? () => {
                eventToDelete.current = data.code;
                setConfirmationOpen(true);
              }
            : undefined;

          return (
            <DashboardEvent key={data.code} onDelete={onDelete} {...data} />
          );
        })}
      </div>
      <ConfirmationDialog
        type="delete"
        autoClose={true}
        title="Delete Event"
        description="Are you sure you want to delete this event?"
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        onConfirm={() => {
          removeEvent();
          return true;
        }}
      />
    </>
  );
}
