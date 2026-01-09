"use client";

import { useState } from "react";

import { Pencil1Icon, Pencil2Icon } from "@radix-ui/react-icons";

import CopyToastButton from "@/components/copy-toast-button";
import HeaderSpacer from "@/components/header-spacer";
import { ResultsAvailabilityMap } from "@/core/availability/types";
import { EventRange } from "@/core/event/types";
import LinkButton from "@/features/button/components/link";
import { AvailabilityDataResponse } from "@/features/event/availability/fetch-data";
import TimeZoneSelector from "@/features/event/components/selectors/timezone";
import ScheduleGrid from "@/features/event/grid/grid";
import EventInfoDrawer, { EventInfo } from "@/features/event/info-drawer";
import { cn } from "@/lib/utils/classname";

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
  /* PARTICIPANT INFO */
  const participated: boolean =
    initialAvailabilityData.user_display_name != null;
  const isCreator: boolean = initialAvailabilityData.is_creator || false;
  const participants: string[] = initialAvailabilityData.participants || [];
  const availabilities: ResultsAvailabilityMap =
    initialAvailabilityData.availability || {};

  /* HOVER HANDLING */
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [numberOfParticipants, setNumberOfParticipants] = useState(
    participants.length,
  );

  const handleHoveredSlot = (iso: string | null) => {
    setHoveredSlot(iso);
    if (iso === null) {
      setNumberOfParticipants(participants.length);
    } else {
      setNumberOfParticipants(availabilities[iso]?.length ?? 0);
    }
  };

  /* TIMEZONE HANDLING */
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  const handleTZChange = (newTZ: string | number) => {
    setTimezone(newTZ.toString());
  };

  return (
    <div className="flex flex-col space-y-4 pl-6 pr-6">
      <HeaderSpacer />
      <div className="md:flex md:justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl">{eventName}</h1>
          <EventInfoDrawer eventRange={eventRange} />
        </div>
        <div className="mt-2 flex w-full flex-wrap-reverse items-end justify-end gap-2 md:mt-0 md:flex-row md:items-center">
          {isCreator && (
            <LinkButton
              buttonStyle="secondary"
              icon={<Pencil1Icon />}
              label="Edit Event"
              shrinkOnMobile
              href={`/${eventCode}/edit`}
            />
          )}
          <CopyToastButton code={eventCode} />
          <LinkButton
            buttonStyle="primary"
            icon={<Pencil2Icon />}
            label={(participated ? "Edit" : "Add") + " Availability"}
            href={`/${eventCode}/painting`}
          />
        </div>
      </div>

      <div className="h-fit md:flex md:flex-row md:gap-4">
        <ScheduleGrid
          mode="view"
          eventRange={eventRange}
          timezone={timezone}
          hoveredSlot={hoveredSlot}
          setHoveredSlot={handleHoveredSlot}
          availabilities={availabilities}
          numParticipants={participants.length}
        />

        <div className="h-25" />

        {/* Sidebar for attendees */}
        <div className="md:top-25 fixed bottom-1 left-0 w-full shrink-0 px-8 md:sticky md:h-full md:w-80 md:space-y-4 md:px-0">
          <div className="bg-panel rounded-3xl p-4 shadow-md md:space-y-6 md:p-6 md:shadow-none">
            <h2 className="text-md mb-2 font-semibold">
              Attendees{" "}
              <span>
                {hoveredSlot
                  ? `(${numberOfParticipants}/${participants.length})`
                  : `(${participants.length}/${participants.length})`}
              </span>
            </h2>
            <ul className="flex flex-wrap space-x-2 space-y-0">
              {participants.length === 0 && (
                <li className="text-sm italic opacity-50">No attendees yet</li>
              )}
              {participants.map((person: string) => {
                const isAvailable =
                  availabilities[hoveredSlot || ""]?.includes(person);
                return (
                  <li
                    key={person}
                    className={cn(
                      "w-fit transition-opacity",
                      {
                        "bg-gray-200/25 line-through opacity-50":
                          hoveredSlot && !isAvailable,
                        "bg-accent/25 text-accent-text opacity-100":
                          !hoveredSlot || isAvailable,
                      },
                      "rounded-full px-3 py-1 text-sm",
                    )}
                  >
                    {person}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-panel hidden rounded-3xl p-6 md:block">
            <EventInfo eventRange={eventRange} />
          </div>

          <div className="bg-panel hidden rounded-3xl p-6 text-sm md:block">
            Displaying event in
            <span className="text-accent ml-1 font-bold">
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
