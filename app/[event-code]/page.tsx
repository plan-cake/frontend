"use client";

import { useAvailability } from "@/app/_lib/availability/use-availability";
import { useEffect, useState } from "react";

import {
  EventRange,
  SpecificDateRange,
  WeekdayMap,
  WeekdayRange,
} from "@/app/_lib/schedule/types";

import CopyToast from "@/app/ui/components/copy-toast";
import EventInfoDrawer, {
  EventInfo,
} from "@/app/ui/components/event-info-drawer";
import ScheduleGrid from "@/app/ui/components/schedule/schedule-grid";
import TimezoneSelect from "@/app/ui/components/selectors/timezone-select";
import { useParams } from "next/navigation";
import formatApiError from "../_utils/format-api-error";

export default function Page() {
  // AVAILABILITY STATE
  const { state, setDisplayName, setTimeZone, toggleSlot } =
    useAvailability("John Doe");
  const { displayName, timeZone, userAvailability } = state;

  // --- CORRECTED ---
  // 1. Create dates in UTC to avoid browser timezone issues.
  const today = new Date();
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [eventName, setEventName] = useState("Loading...");
  const [eventRange, setEventRange] = useState<EventRange>({
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
  });

  // get the event data from the code in the URL
  const params = useParams();
  const eventCode = params?.["event-code"];
  useEffect(() => {
    fetch("/api/event/get-details?event_code=" + eventCode, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setEventName(data.title);
          if (data.event_type === "Date") {
            const newRange: SpecificDateRange = {
              type: "specific",
              duration: data.duration,
              timezone: data.time_zone,
              dateRange: {
                from: data.start_date,
                to: data.end_date,
              },
              timeRange: {
                from: data.start_hour,
                to: data.end_hour,
              },
            };
            setEventRange(newRange);
          } else {
            const dayKeys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const weekdays: WeekdayMap = {
              Sun: 0,
              Mon: 0,
              Tue: 0,
              Wed: 0,
              Thu: 0,
              Fri: 0,
              Sat: 0,
            };
            for (let i = data.start_weekday; i <= data.end_weekday; i++) {
              weekdays[dayKeys[i] as keyof WeekdayMap] = 1;
            }
            const newRange: WeekdayRange = {
              type: "weekday",
              duration: data.duration,
              timezone: data.time_zone,
              weekdays: weekdays,
              timeRange: {
                from: data.start_hour,
                to: data.end_hour,
              },
            };
            setEventRange(newRange);
          }
        } else {
          alert(formatApiError(await res.json()));
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, [eventCode]);

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
        <div className="h-fit w-full shrink-0 space-y-6 overflow-y-auto md:sticky md:top-30 md:w-80">
          <div>
            <span className="text-lg">
              Hi,{" "}
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="add your name"
                className="inline-block w-auto border-b border-violet bg-transparent px-1 focus:outline-none dark:border-gray-400"
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
              <TimezoneSelect value={timeZone} onChange={setTimeZone} />
            </span>
          </div>
        </div>

        {/* Right Panel */}
        <ScheduleGrid
          mode="paint"
          eventRange={eventRange}
          timezone={timeZone}
          onToggleSlot={toggleSlot}
          userAvailability={userAvailability}
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
