"use client";

import { useState } from "react";
import HeaderSpacer from "../../ui/components/header/header-spacer";
import EventGrid, { EventGridProps } from "../components/dashboard/event-grid";

type DashboardTab = "created" | "participated";

type DashboardPageProps = {
  created_events: EventGridProps;
  participated_events: EventGridProps;
};

export default function DashboardPage({
  created_events,
  participated_events,
}: DashboardPageProps) {
  const [tab, setTab] = useState<DashboardTab>("created");

  return (
    <div className="min-h-screen p-6">
      <HeaderSpacer />
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="flex">
        <div className="flex flex-col gap-4">
          <button
            className={`rounded px-4 py-2 ${
              tab === "created"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setTab("created")}
          >
            Created Events
          </button>
          <button
            className={`rounded px-4 py-2 ${
              tab === "participated"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setTab("participated")}
          >
            Participated Events
          </button>
        </div>
        <EventGrid
          events={tab === "created" ? created_events : participated_events}
        />
      </div>
    </div>
  );
}
