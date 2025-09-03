"use client";

import { useState, useEffect } from "react";

import ScheduleGrid from "@/app/ui/components/schedule/schedule-grid";
import EventInfoDrawer from "@/app/ui/components/event-info-drawer";
import CopyToast from "@/app/ui/components/copy-toast";
import TimezoneSelect from "@/app/ui/components/timezone-select";

import { EventInfo } from "@/app/ui/components/event-info-drawer";
import { getUtcIsoSlot } from "@/app/_lib/availability/utils";
import { Pencil1Icon } from "@radix-ui/react-icons";

const fillerAttendees = [
  {
    name: "Alice",
    availability: new Set([
      getUtcIsoSlot(
        "2025-07-17",
        10,
        0,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      ),
      getUtcIsoSlot(
        "2025-07-16",
        11,
        0,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      ),
      getUtcIsoSlot(
        "2025-07-11",
        14,
        0,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      ),
    ]),
  },
  {
    name: "Bob",
    availability: new Set([
      getUtcIsoSlot(
        "2025-07-17",
        10,
        0,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      ),
      getUtcIsoSlot(
        "2025-07-11",
        14,
        0,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      ),
      getUtcIsoSlot(
        "2025-07-12",
        9,
        0,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      ),
    ]),
  },
  {
    name: "Carol",
    availability: new Set([
      getUtcIsoSlot(
        "2025-07-17",
        10,
        0,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      ),
      getUtcIsoSlot(
        "2025-07-12",
        9,
        0,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      ),
    ]),
  },
];

export default function Page() {
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  const handleTZChange = (newTZ: string | number) => {
    setTimezone(newTZ.toString());
  };

  const [userName, setUserName] = useState("John Doe");
  const [eventName, setEventName] = useState("Event Name");
  const [attendees, setAttendees] = useState(fillerAttendees);
  const [eventCode, setEventCode] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(true);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching from backend
    const fetchEventData = async () => {
      try {
        const res = await fetch("/api/event/12345"); // Replace with actual event ID or dynamic routing
        const data = await res.json();

        setEventName(data.eventName);
        setEventCode(data.eventCode);
        setAttendees(
          data.attendees.map((a: any) => ({
            name: a.name,
            availability: new Set(a.availability),
          })),
        );
        setIsOwner(data.owner === userName);
      } catch (error) {
        console.error("Failed to load event data:", error);
      }
    };

    // fetchEventData();
  }, [userName]);

  // Placeholder eventRange
  const today = new Date("2025-07-11T00:00:00");
  const eventRange = {
    type: "specific" as const,
    duration: 60 * 7,
    timezone,
    dateRange: {
      from: today,
      to: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
    },
    timeRange: {
      from: new Date(today.setHours(0, 0, 0, 0)),
      to: new Date(today.setHours(23, 0, 0, 0)),
    },
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl dark:border-gray-400">{eventName}</h1>
          <EventInfoDrawer eventRange={eventRange} />
        </div>
        <div className="flex items-center gap-2">
          {isOwner && (
            <button className="rounded-full border-2 border-blue px-4 py-2 text-sm hover:bg-blue-100 dark:border-red dark:hover:bg-red/25">
              <span className="hidden md:block">Edit Event</span>
              <Pencil1Icon width={16} height={16} className="md:hidden" />
            </button>
          )}
          <CopyToast
            label="Copy Link"
            eventLink={origin ? `${origin}/event/${eventCode}` : ""}
          />
        </div>
      </div>

      <div className="h-fit md:flex md:flex-row md:gap-4">
        <ScheduleGrid
          eventRange={eventRange}
          timezone={timezone}
          mode="view"
          attendees={fillerAttendees}
          hoveredSlot={hoveredSlot}
          setHoveredSlot={setHoveredSlot}
        />

        {/* Sidebar for attendees */}
        <div className="sticky bottom-8 h-fit w-full shrink-0 space-y-3 md:top-8 md:w-80">
          <div className="space-y-4 rounded-3xl bg-[#FFFFFF] p-4 md:space-y-6 md:p-6 dark:bg-[#343249]">
            <h2 className="mb-2 text-lg font-semibold">Attendees</h2>
            <ul className="flex flex-wrap space-y-0 space-x-2 text-gray-700 dark:text-gray-200">
              {fillerAttendees.map((attendee) => {
                const isAvailable = hoveredSlot
                  ? attendee.availability.has(hoveredSlot)
                  : true;
                return (
                  <li
                    key={attendee.name}
                    className={`flex items-center gap-2 transition-opacity ${
                      hoveredSlot && !isAvailable
                        ? "line-through opacity-50"
                        : "opacity-100"
                    }`}
                  >
                    {attendee.name}
                  </li>
                );
              })}
            </ul>
          </div>

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
      </div>
    </div>
  );
}
