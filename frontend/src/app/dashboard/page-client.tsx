"use client";

import { useRef, useState } from "react";

import Link from "next/link";

import HeaderSpacer from "@/components/header-spacer";
import SegmentedControl from "@/components/segmented-control";
import { useAccount } from "@/features/account/context";
import { DashboardEventProps } from "@/features/dashboard/components/event";
import EventGrid from "@/features/dashboard/components/event-grid";
import { Banner, ConfirmationDialog } from "@/features/system-feedback";

type DashboardTab = "created" | "participated";

export type DashboardPageProps = {
  created_events: DashboardEventProps[];
  participated_events: DashboardEventProps[];
};

export default function ClientPage({
  created_events,
  participated_events,
}: DashboardPageProps) {
  const [createdEvents, setCreatedEvents] = useState(created_events);
  const [participatedEvents, setParticipatedEvents] =
    useState(participated_events);
  const [tab, setTab] = useState<DashboardTab>(
    !created_events.length && participated_events.length
      ? "participated"
      : "created",
  );

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const eventToDelete = useRef<string | null>(null);

  const { loginState } = useAccount();

  const currentTabEvents =
    tab === "created" ? createdEvents : participatedEvents;

  const deleteEvent = (eventCode: string) => {
    // Immediate UI update
    if (tab === "created") {
      setCreatedEvents(createdEvents.filter((e) => e.code !== eventCode));
    } else {
      setParticipatedEvents(
        participatedEvents.filter((e) => e.code !== eventCode),
      );
    }

    // API call
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/delete/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ event_code: eventCode }),
      });
    } catch (e) {
      console.error("Error deleting event:", e);
    }
  };

  const handleDeleteEvent = (eventCode: string) => {
    eventToDelete.current = eventCode;
    setConfirmationOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col gap-4 px-6 pb-4">
      <HeaderSpacer />
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {loginState === "logged_out" && (
        <Banner type="info" title="Logged in as a Guest">
          <div>
            This data is only available from this browser.{" "}
            <Link
              href="/register"
              className="text-accent cursor-pointer font-bold hover:underline"
            >
              Create an account
            </Link>{" "}
            to sync your data across devices.
          </div>
        </Banner>
      )}
      <div className="bg-panel w-full rounded-3xl">
        <div className="px-2 pt-2">
          <SegmentedControl
            value={tab}
            onChange={setTab}
            options={[
              { label: "My Events", value: "created" },
              { label: "Others' Events", value: "participated" },
            ]}
          />
        </div>
        <div className="p-4 pt-2">
          {currentTabEvents.length ? (
            <EventGrid
              events={currentTabEvents}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-4 text-center italic opacity-75">
              <div>
                {tab === "created"
                  ? "You haven't created any events yet."
                  : "You haven't participated in any events yet."}
              </div>
              <div>{`When you do, it'll show up here for quick access!`}</div>
            </div>
          )}
        </div>
      </div>
      <ConfirmationDialog
        type="delete"
        autoClose={true}
        title="Delete Event"
        description="Are you sure you want to delete this event?"
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        onConfirm={() => {
          deleteEvent(eventToDelete.current!);
          return true;
        }}
      />
    </div>
  );
}
