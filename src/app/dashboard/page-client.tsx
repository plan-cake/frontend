"use client";

import { useState } from "react";

import Link from "next/link";

import HeaderSpacer from "@/components/header-spacer";
import { useAccount } from "@/features/account/context";
import EventGrid, {
  EventGridProps,
} from "@/features/dashboard/components/event-grid";
import { Banner } from "@/features/system-feedback";
import useCheckMobile from "@/lib/hooks/use-check-mobile";
import { cn } from "@/lib/utils/classname";

type DashboardTab = "created" | "participated";

export type DashboardPageProps = {
  created_events: EventGridProps;
  participated_events: EventGridProps;
};

export default function ClientPage({
  created_events,
  participated_events,
}: DashboardPageProps) {
  const [tab, setTab] = useState<DashboardTab>("created");
  const isMobile = useCheckMobile();
  const { loginState } = useAccount();

  return (
    <div className="flex min-h-screen flex-col gap-4 pl-6 pr-6">
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
      <div className={cn("flex gap-4", isMobile && "flex-col")}>
        <div className={cn("flex", !isMobile && "flex-col")}>
          <DashboardTabButton
            label="My Events"
            value="created"
            currentTab={tab}
            isMobile={isMobile}
            setTab={setTab}
          />
          <DashboardTabButton
            label="Others' Events"
            value="participated"
            currentTab={tab}
            isMobile={isMobile}
            setTab={setTab}
          />
        </div>
        <div className="bg-panel w-full rounded-3xl p-4">
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
      type="button"
      className={cn(
        "text-nowrap rounded-full px-4 py-2",
        currentTab === value
          ? "bg-accent text-white"
          : "hover:bg-accent/25 cursor-pointer",
        !isMobile && "w-full text-left",
      )}
      onClick={() => setTab(value)}
    >
      {label}
    </button>
  );
}
