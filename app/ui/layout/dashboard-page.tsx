"use client";

import { cn } from "@/app/_lib/classname";
import useCheckMobile from "@/app/_lib/use-check-mobile";
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
  const isMobile = useCheckMobile();

  return (
    <div className="min-h-screen p-6">
      <HeaderSpacer />
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className={cn("flex gap-4", isMobile && "flex-col")}>
        <div className={cn("flex", !isMobile && "flex-col gap-2")}>
          <DashboardTabButton
            label="Created Events"
            value="created"
            currentTab={tab}
            isMobile={isMobile}
            setTab={setTab}
          />
          <DashboardTabButton
            label="Participated Events"
            value="participated"
            currentTab={tab}
            isMobile={isMobile}
            setTab={setTab}
          />
        </div>
        <div className="w-full rounded-3xl bg-[#FFFFFF] p-4 dark:bg-[#343249]">
          <EventGrid
            events={tab === "created" ? created_events : participated_events}
          />
        </div>
      </div>
    </div>
  );
}

function DashboardTabButton({
  label,
  value,
  currentTab,
  isMobile,
  setTab,
}: {
  label: string;
  value: DashboardTab;
  currentTab: DashboardTab;
  isMobile: boolean;
  setTab: (value: DashboardTab) => void;
}) {
  return (
    <button
      className={cn(
        "rounded-full px-4 py-2 text-nowrap",
        currentTab === value && "bg-blue text-white dark:bg-red",
        !isMobile && "w-full text-left",
      )}
      onClick={() => setTab(value)}
    >
      {label}
    </button>
  );
}
