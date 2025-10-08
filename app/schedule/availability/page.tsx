"use client";

import { useState } from "react";

import { EventRange } from "@/app/_lib/schedule/types";

import ScheduleGrid from "@/app/ui/components/schedule/schedule-grid";
import EventInfoDrawer from "@/app/ui/components/event-info-drawer";
import CopyToast from "@/app/ui/components/copy-toast";
import TimezoneSelect from "@/app/ui/components/selectors/timezone-select";
import { EventInfo } from "@/app/ui/components/event-info-drawer";

export default function Page() {
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  const handleTZChange = (newTZ: string | number) => {
    setTimezone(newTZ.toString());
  };

  const [userName, setUserName] = useState("John Doe");

  const eventName = "Sample Event";

  // --- CORRECTED ---
  // 1. Create dates in UTC to avoid browser timezone issues.
  const today = new Date();
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const eventRange: EventRange = {
    type: "specific",
    duration: 60,
    // 2. Set the event's *original* timezone, not the user's.
    timezone: "America/New_York",
    dateRange: {
      from: formatDate(today),
      to: formatDate(today),
    },
    // This timeRange is for the valid times within a day
    timeRange: {
      from: 9,
      to: 20,
    },
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Header and Button Row */}
      <div className="flex justify-between md:flex-row">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl dark:border-gray-400">{eventName}</h1>
          <EventInfoDrawer eventRange={eventRange} />
        </div>

        <div className="flex items-center gap-2">
          <CopyToast label="Copy Link" />
          <button className="hidden rounded-full border-2 border-blue bg-blue px-4 py-2 text-sm text-white transition-shadow hover:shadow-[0px_0px_32px_0_rgba(61,115,163,.70)] md:flex dark:border-red dark:bg-red dark:hover:shadow-[0px_0px_32px_0_rgba(255,92,92,.70)]">
            Submit Availability
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8 flex h-fit flex-col gap-4 md:mb-0 md:flex-row">
        {/* Left Panel */}
        <div className="h-fit w-full shrink-0 space-y-6 overflow-y-auto md:sticky md:top-8 md:w-80">
          <div>
            <span className="text-lg">
              Hi,{" "}
              <input
                type="text"
                placeholder="add your name"
                // value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="inline-block w-auto border-b border-violet bg-transparent px-1 focus:outline-none dark:border-gray-400"
                style={{ minWidth: "6ch" }}
              />
              <br />
              add your availabilities here
            </span>
          </div>

          {/* Desktop-only Event Info */}
          <div className="hidden rounded-3xl bg-[#FFFFFF] p-6 md:block dark:bg-[#343249]">
            <EventInfo eventRange={eventRange} />
          </div>

          <div className="rounded-3xl bg-[#FFFFFF] p-4 text-sm dark:bg-[#343249]">
            Displaying event in
            <span className="ml-1 font-bold text-blue dark:text-red">
              <TimezoneSelect value={timezone} onChange={handleTZChange} />
            </span>
          </div>
        </div>

        {/* Right Panel */}
        <ScheduleGrid
          mode="paint"
          eventRange={eventRange}
          timezone={timezone}
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full px-4 md:hidden">
        <div className="rounded-t-full bg-blue p-4 text-center text-white dark:bg-red">
          Submit Availability
        </div>
      </div>
    </div>
  );
}
