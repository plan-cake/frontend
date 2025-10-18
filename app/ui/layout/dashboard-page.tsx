"use client";

import { useState } from "react";
import HeaderSpacer from "../../ui/components/header/header-spacer";
import EventGrid, { EventGridProps } from "../components/dashboard/event-grid";
import { cn } from "@/app/_lib/classname";

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
        <div className="flex flex-col gap-2">
          <DashboardTabButton
            label="Created Events"
            value="created"
            currentTab={tab}
            setTab={setTab}
          />
          <DashboardTabButton
            label="Participated Events"
            value="participated"
            currentTab={tab}
            setTab={setTab}
          />
        </div>
        <EventGrid
          events={tab === "created" ? created_events : participated_events}
        />
      </div>
    </div>
  );
}

function DashboardTabButton({
  label,
  value,
  currentTab,
  setTab,
}: {
  label: string;
  value: DashboardTab;
  currentTab: DashboardTab;
  setTab: (value: DashboardTab) => void;
}) {
  return (
    <button
      className={cn(
        "w-full rounded-full px-4 py-2 text-left",
        currentTab === value && "bg-blue text-white dark:bg-red",
      )}
      onClick={() => setTab(value)}
    >
      {label}
    </button>
  );
}
