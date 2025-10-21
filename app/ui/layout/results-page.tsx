"use client";

import ScheduleGrid from "@/app/ui/components/schedule/schedule-grid";
import EventInfoDrawer from "@/app/ui/components/event-info-drawer";
import CopyToast from "@/app/ui/components/toasts/copy-toast";
import TimeZoneSelector from "../components/selectors/timezone-selector";

import { EventInfo } from "@/app/ui/components/event-info-drawer";
import { Pencil1Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { EventRange } from "@/app/_lib/schedule/types";
import { ResultsAvailabilityMap } from "@/app/_lib/availability/types";
import Link from "next/link";
import { AvailabilityDataResponse } from "@/app/_utils/fetch-data";
import HeaderSpacer from "../components/header/header-spacer";

export default function ResultsPage({
  eventCode,
  eventName,
  eventRange,
  initialAvailabilityData,
}: {
  eventCode: string;
  eventName: string;
  eventRange: EventRange;
  initialAvailabilityData: AvailabilityDataResponse;
}) {
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const handleTZChange = (newTZ: string | number) => {
    setTimezone(newTZ.toString());
  };

  const participated: boolean =
    initialAvailabilityData.user_display_name != null;
  const isCreator: boolean = initialAvailabilityData.is_creator || false;
  const participants: string[] = initialAvailabilityData.participants || [];
  const availabilities: ResultsAvailabilityMap =
    initialAvailabilityData.availability || {};

  return (
    <div className="flex flex-col space-y-4 pr-6 pl-6">
      <HeaderSpacer />
      <div className="md:flex md:justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl dark:border-gray-400">{eventName}</h1>
          <EventInfoDrawer eventRange={eventRange} />
        </div>
        <div className="mt-2 flex w-full flex-wrap-reverse items-end justify-end gap-2 md:mt-0 md:flex-row md:items-center">
          {isCreator && (
            <Link
              className="flex flex-row items-center gap-2 rounded-full border-2 border-blue p-2 text-sm hover:bg-blue-100 dark:border-red dark:hover:bg-red/25"
              href={`/${eventCode}/edit`}
            >
              <Pencil1Icon className="h-5 w-5" />
              <span className="hidden md:block">Edit Event</span>
            </Link>
          )}
          <CopyToast code={eventCode} />
          <Link
            className="flex flex-row items-center gap-2 rounded-full border-2 border-blue bg-blue p-2 text-sm text-white hover:bg-blue-100 hover:text-violet dark:border-red dark:bg-red dark:hover:bg-red/25"
            href={`/${eventCode}/painting`}
          >
            <Pencil2Icon className="h-5 w-5" />
            <span>{participated ? "Edit" : "Add"} Availability</span>
          </Link>
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

        <div className="h-25" />

        {/* Sidebar for attendees */}
        <div className="fixed bottom-1 left-0 w-full shrink-0 px-8 md:sticky md:top-25 md:h-full md:w-80 md:space-y-4 md:px-0">
          <div className="rounded-3xl bg-[#FFFFFF] p-4 shadow-md md:space-y-6 md:p-6 md:shadow-none dark:bg-[#343249]">
            <h2 className="mb-2 text-lg font-semibold">Attendees</h2>
            <ul className="flex flex-wrap space-y-0 space-x-2 text-gray-700 dark:text-gray-200">
              {participants.length === 0 && (
                <li className="text-sm italic opacity-50">No attendees yet</li>
              )}
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

          <div className="hidden rounded-3xl bg-[#FFFFFF] p-4 text-sm md:block dark:bg-[#343249]">
            Displaying event in
            <span className="ml-1 font-bold text-blue dark:text-red">
              <TimeZoneSelector
                id="timezone-select"
                value={timezone}
                onChange={handleTZChange}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
