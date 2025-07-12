"use client";

import { useState } from "react";
import ScheduleGrid from "@/app/ui/components/schedule/schedule-grid";
import { getUtcIsoSlot } from "@/app/_types/user-availability";

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
  const eventName = "Sample Event";
  const today = new Date("2025-07-11T00:00:00");
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    9,
    0,
    0,
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    16,
    0,
    0,
  );

  const eventRange = {
    type: "specific" as const,
    duration: 60 * 7,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateRange: {
      from: today,
      to: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    },
    timeRange: {
      from: startOfDay,
      to: endOfDay,
    },
  };

  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl dark:border-gray-400">{eventName}</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-full border-2 border-blue px-4 py-2 text-sm hover:bg-blue-100 dark:border-red dark:hover:bg-red/25">
            Copy Link
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <ScheduleGrid
          eventRange={eventRange}
          timezone={eventRange.timezone}
          mode="view"
          attendees={fillerAttendees}
          hoveredSlot={hoveredSlot}
          setHoveredSlot={setHoveredSlot}
        />

        <div className="w-80 shrink-0 overflow-y-auto">
          <div className="space-y-6 rounded-3xl bg-[#FFFFFF] p-6 dark:bg-[#343249]">
            <h2 className="mb-2 text-lg font-semibold">Attendees</h2>
            <ul className="space-y-1 text-gray-700 dark:text-gray-200">
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
