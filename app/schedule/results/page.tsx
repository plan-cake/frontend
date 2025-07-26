"use client";

import { useState, useEffect } from "react";
import ScheduleGrid from "@/app/ui/components/schedule/schedule-grid";
import { getUtcIsoSlot } from "@/app/_types/user-availability";
import { CopyIcon, Pencil1Icon } from "@radix-ui/react-icons";

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
  const [userName, setUserName] = useState("John Doe");
  const [eventName, setEventName] = useState("Event Name");
  const [attendees, setAttendees] = useState(fillerAttendees);
  const [eventCode, setEventCode] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(true);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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

  const handleCopyLink = () => {
    const link = `${window.location.origin}/event/${eventCode}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Event link copied!");
    });
  };

  // Placeholder eventRange
  const today = new Date("2025-07-11T00:00:00");
  const eventRange = {
    type: "specific" as const,
    duration: 60 * 7,
    timezone,
    dateRange: {
      from: today,
      to: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    },
    timeRange: {
      from: new Date(today.setHours(9, 0, 0, 0)),
      to: new Date(today.setHours(20, 0, 0, 0)),
    },
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl dark:border-gray-400">{eventName}</h1>
        <div className="flex items-center gap-2">
          {isOwner && (
            <button className="rounded-full border-2 border-blue px-4 py-2 text-sm hover:bg-blue-100 dark:border-red dark:hover:bg-red/25">
              <span className="hidden md:block">Edit Event</span>
              <Pencil1Icon width={16} height={16} className="md:hidden" />
            </button>
          )}
          <button
            onClick={handleCopyLink}
            className="rounded-full border-2 border-blue bg-blue px-4 py-2 text-sm text-white hover:shadow-[0px_0px_32px_0_rgba(61,115,163,.70)] dark:border-red dark:bg-red dark:hover:shadow-[0px_0px_32px_0_rgba(255,92,92,.70)]"
          >
            <span className="hidden md:block">Copy Link</span>
            <CopyIcon width={16} height={16} className="md:hidden" />
          </button>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-4 md:flex-row">
        <ScheduleGrid
          eventRange={eventRange}
          timezone={eventRange.timezone}
          mode="view"
          attendees={fillerAttendees}
          hoveredSlot={hoveredSlot}
          setHoveredSlot={setHoveredSlot}
        />

        {/* Sidebar for attendees */}
        <div className="w-full shrink-0 md:w-80">
          <div className="sticky top-8 space-y-4 rounded-3xl bg-[#FFFFFF] p-4 md:space-y-6 md:p-6 dark:bg-[#343249]">
            <h2 className="mb-2 text-lg font-semibold">Attendees</h2>
            <ul className="flex flex-wrap space-y-0 space-x-2 text-gray-700 md:flex-col md:space-y-1 md:space-x-0 dark:text-gray-200">
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
        </div>
      </div>
    </div>
  );
}
