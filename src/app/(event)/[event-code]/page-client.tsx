"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil1Icon, Pencil2Icon } from "@radix-ui/react-icons";

import { EventRange } from "@/src/core/event/types";
import { ResultsAvailabilityMap } from "@/src/core/availability/types";
import { AvailabilityDataResponse } from "@/src/features/event/availability/fetch-data";

import ScheduleGrid from "@/src/features/event/grid/grid";
import CopyToast from "@/src/components/copy-toast";
import TimeZoneSelector from "@/src/features/event/components/timezone-selector";
import HeaderSpacer from "@/src/components/header-spacer";
import EventInfoDrawer from "@/src/features/event/info-drawer";
import { EventInfo } from "@/src/features/event/info-drawer";

export default function ClientPage({
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
    <div className="flex flex-col space-y-4 pl-6 pr-6">
      <HeaderSpacer />
      <div className="md:flex md:justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl dark:border-gray-400">{eventName}</h1>
          <EventInfoDrawer eventRange={eventRange} />
        </div>
        <div className="mt-2 flex w-full flex-wrap-reverse items-end justify-end gap-2 md:mt-0 md:flex-row md:items-center">
          {isCreator && (
            <Link
              className="border-blue dark:border-red dark:hover:bg-red/25 flex flex-row items-center gap-2 rounded-full border-2 p-2 text-sm hover:bg-blue-100"
              href={`/${eventCode}/edit`}
            >
              <Pencil1Icon className="h-5 w-5" />
              <span className="hidden md:block">Edit Event</span>
            </Link>
          )}
          <CopyToast code={eventCode} />
          <Link
            className="border-blue bg-blue dark:border-red dark:bg-red dark:hover:bg-red/25 flex flex-row items-center gap-2 rounded-full border-2 p-2 text-sm text-white hover:bg-blue-100 hover:text-violet"
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
        <div className="md:top-25 fixed bottom-1 left-0 w-full shrink-0 px-8 md:sticky md:h-full md:w-80 md:space-y-4 md:px-0">
          <div className="rounded-3xl bg-[#FFFFFF] p-4 shadow-md dark:bg-[#343249] md:space-y-6 md:p-6 md:shadow-none">
            <h2 className="mb-2 text-lg font-semibold">Attendees</h2>
            <ul className="flex flex-wrap space-x-2 space-y-0 text-gray-700 dark:text-gray-200">
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

          <div className="hidden rounded-3xl bg-[#FFFFFF] p-6 dark:bg-[#343249] md:block">
            <EventInfo eventRange={eventRange} />
          </div>

          <div className="hidden rounded-3xl bg-[#FFFFFF] p-4 text-sm dark:bg-[#343249] md:block">
            Displaying event in
            <span className="text-blue dark:text-red ml-1 font-bold">
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
