"use client";

import ScheduleGrid from "@/app/ui/components/schedule/schedule-grid";
import EventInfoDrawer from "@/app/ui/components/event-info-drawer";
import CopyToast from "@/app/ui/components/toasts/copy-toast";
import TimezoneSelect from "@/app/ui/components/selectors/timezone-select";

import { EventInfo } from "@/app/ui/components/event-info-drawer";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { EventRange } from "@/app/_lib/schedule/types";
import { ResultsAvailabilityMap } from "@/app/_lib/availability/types";

export default function ResultsPage({
  eventCode,
  eventName,
  eventRange,
  initialAvailabilityData,
}: {
  eventCode: string;
  eventName: string;
  eventRange: EventRange;
  initialAvailabilityData: any;
}) {
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const handleTZChange = (newTZ: string | number) => {
    setTimezone(newTZ.toString());
  };

  const isCreator: boolean = initialAvailabilityData.is_creator || false;
  const participants: string[] = initialAvailabilityData.participants || [];
  const availabilities: ResultsAvailabilityMap =
    initialAvailabilityData.availability || {};

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl dark:border-gray-400">{eventName}</h1>
          <EventInfoDrawer eventRange={eventRange} />
        </div>
        <div className="flex items-center gap-2">
          {isCreator && (
            <button className="rounded-full border-2 border-blue px-4 py-2 text-sm hover:bg-blue-100 dark:border-red dark:hover:bg-red/25">
              <span className="hidden md:block">Edit Event</span>
              <Pencil1Icon width={16} height={16} className="md:hidden" />
            </button>
          )}
          <CopyToast
            label="Copy Link"
            eventLink={
              window.location.origin
                ? `${window.location.origin}/${eventCode}`
                : ""
            }
          />
        </div>
      </div>

      <div className="h-fit md:flex md:flex-row md:gap-4">
        <ScheduleGrid
          mode="view"
          eventRange={eventRange}
          timezone={timezone}
          hoveredSlot={hoveredSlot}
          setHoveredSlot={setHoveredSlot}
          availabilities={availabilities}
          numParticipants={participants.length}
        />

        {/* Sidebar for attendees */}
        <div className="sticky bottom-8 h-fit w-full shrink-0 space-y-3 md:top-25 md:w-80">
          <div className="space-y-4 rounded-3xl bg-[#FFFFFF] p-4 md:space-y-6 md:p-6 dark:bg-[#343249]">
            <h2 className="mb-2 text-lg font-semibold">Attendees</h2>
            <ul className="flex flex-wrap space-y-0 space-x-2 text-gray-700 dark:text-gray-200">
              {participants.map((person: string) => {
                const isAvailable =
                  availabilities[hoveredSlot || ""]?.includes(person);
                return (
                  <li
                    key={person}
                    className={`flex items-center gap-2 transition-opacity ${
                      hoveredSlot && !isAvailable
                        ? "line-through opacity-50"
                        : "opacity-100"
                    }`}
                  >
                    {person}
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
