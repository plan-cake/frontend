"use client";

import { cn } from "@/app/_lib/classname";
import { LoginContext } from "@/app/_lib/providers";
import useCheckMobile from "@/app/_lib/use-check-mobile";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useContext, useState } from "react";
import HeaderSpacer from "../../ui/components/header/header-spacer";
import EventGrid, { EventGridProps } from "../components/dashboard/event-grid";

type DashboardTab = "created" | "participated";

export type DashboardPageProps = {
  created_events: EventGridProps;
  participated_events: EventGridProps;
};

export default function DashboardPage({
  created_events,
  participated_events,
}: DashboardPageProps) {
  const [tab, setTab] = useState<DashboardTab>("created");
  const isMobile = useCheckMobile();
  const { loggedIn } = useContext(LoginContext);

  return (
    <div className="flex min-h-screen flex-col gap-4 pr-6 pl-6">
      <HeaderSpacer />
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {loggedIn === false && (
        <div className="flex items-center gap-4 rounded-3xl bg-blue/20 p-4 dark:bg-red/20">
          <InfoCircledIcon className="h-5 w-5" />
          <div>
            <h2 className="text-lg font-bold">Logged in as a Guest</h2>
            <div>
              This data is only available from this browser.{" "}
              <Link
                href="/register"
                className="cursor-pointer font-bold text-blue hover:underline dark:text-red"
              >
                Create an account
              </Link>{" "}
              to sync your data across devices.
            </div>
          </div>
        </div>
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
        currentTab === value
          ? "bg-blue text-white dark:bg-red"
          : "cursor-pointer transition hover:bg-blue/25 dark:hover:bg-red/25",
        !isMobile && "w-full text-left",
      )}
      onClick={() => setTab(value)}
    >
      {label}
    </button>
  );
}
