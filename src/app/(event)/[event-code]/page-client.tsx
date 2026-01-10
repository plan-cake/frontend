"use client";

import { useState, useEffect } from "react";

import {
  CheckIcon,
  EraserIcon,
  Pencil1Icon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";

import ConfirmationDialog from "@/components/confirmation-dialog";
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
  timeslots,
  initialAvailabilityData,
  isCreator,
}: {
  eventCode: string;
  eventName: string;
  eventRange: EventRange;
  timeslots: Date[];
  initialAvailabilityData: AvailabilityDataResponse;
  isCreator: boolean;
}) {
  /* PARTICIPANT INFO */
  const participated: boolean =
    initialAvailabilityData.user_display_name != null;

  /* PARTICIPANT STATES */
  const [removingParticipants, setRemovingParticipants] = useState(false);
  const [participants, setParticipants] = useState(
    initialAvailabilityData.participants || [],
  );
  const [availabilities, setAvailabilities] = useState<ResultsAvailabilityMap>(
    initialAvailabilityData.availability || {},
  );

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

  const handleRemoveParticipant = async (person: string) => {
    if (!isCreator) return false;

    try {
      const response = await fetch("/api/availability/remove/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_code: eventCode,
          display_name: person,
        }),
      });

      if (!response.ok) {
        console.log("Failed to remove participant:", response.statusText);
        return false;
      }

      setParticipants((prev) => prev.filter((p) => p !== person));
      setAvailabilities((prev) => {
        const updated = { ...prev };
        for (const slot in updated) {
          updated[slot] = updated[slot].filter((p) => p !== person);
        }
        return updated;
      });

      if (hoveredSlot) {
        setNumberOfParticipants((prev) => prev - 1);
      }

      return true;
    } catch (error) {
      console.error("Error removing participant:", error);
      return false;
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && removingParticipants) {
        setRemovingParticipants(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [removingParticipants]);

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
          timeslots={timeslots}
        />

        <div className="h-25" />

        {/* Sidebar for attendees */}
        <div className="md:top-25 fixed bottom-1 left-0 w-full shrink-0 px-8 md:sticky md:h-full md:w-80 md:space-y-4 md:px-0">
          <div className="bg-panel rounded-3xl p-4 shadow-md md:space-y-2 md:p-6 md:shadow-none">
            <div className="flex items-center justify-between">
              <h2 className="text-md font-semibold">
                Attendees{" "}
                <span>
                  {hoveredSlot
                    ? `(${numberOfParticipants}/${participants.length})`
                    : `(${participants.length}/${participants.length})`}
                </span>
              </h2>
              <button
                className={cn(
                  "text-red bg-red/15 rounded-full p-2 text-sm font-semibold",
                  "hover:bg-red/25 active:bg-red/40",
                )}
                onClick={() => setRemovingParticipants(!removingParticipants)}
              >
                {removingParticipants && participants.length > 0 ? (
                  <CheckIcon className="h-5 w-5" />
                ) : isCreator && participants.length > 0 ? (
                  <EraserIcon className="h-5 w-5" />
                ) : (
                  ""
                )}
              </button>
            </div>

            <ul className="flex flex-wrap gap-2">
              {participants.length === 0 && (
                <li className="text-sm italic opacity-50">No attendees yet</li>
              )}
              {participants.map((person: string, index: number) => {
                const isAvailable =
                  availabilities[hoveredSlot || ""]?.includes(person);

                const delay = (index % 4) * -0.1;

                return (
                  <ConfirmationDialog
                    key={person}
                    type="delete"
                    title="Remove Participant"
                    description={
                      <span>
                        Are you sure you want to remove{" "}
                        <span className="font-bold">{person}</span>?
                      </span>
                    }
                    onConfirm={() => handleRemoveParticipant(person)}
                    disabled={!removingParticipants}
                  >
                    <li
                      key={person}
                      style={{
                        animationDelay: `${delay}s`,
                      }}
                      className={cn(
                        // layout
                        "relative flex items-center justify-center",
                        "w-fit transition-all duration-200",
                        "rounded-full px-3 py-1 text-sm",

                        // availability state
                        {
                          "bg-gray-200/25 line-through opacity-50":
                            hoveredSlot && !isAvailable,
                          "bg-accent/25 text-accent-text opacity-100":
                            !hoveredSlot || isAvailable,
                        },

                        // hover state
                        isCreator &&
                          removingParticipants &&
                          participants.length > 0 &&
                          "hover:bg-red animate-wiggle group scale-105 hover:cursor-pointer hover:text-white hover:opacity-100 active:bg-red-400 md:scale-100",
                      )}
                    >
                      <span className="transition-opacity duration-200 group-hover:opacity-0">
                        {person}
                      </span>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <TrashIcon className="h-4 w-4" />
                      </div>
                    </li>
                  </ConfirmationDialog>
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
