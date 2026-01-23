"use client";

import { useState, useOptimistic, useRef, useEffect } from "react";

import { Pencil1Icon, Pencil2Icon } from "@radix-ui/react-icons";

import CopyToastButton from "@/components/copy-toast-button";
import HeaderSpacer from "@/components/header-spacer";
import MobileFooterTray from "@/components/mobile-footer-tray";
import { ResultsAvailabilityMap } from "@/core/availability/types";
import { EventRange } from "@/core/event/types";
import LinkButton from "@/features/button/components/link";
import { AvailabilityDataResponse } from "@/features/event/availability/fetch-data";
import TimeZoneSelector from "@/features/event/components/selectors/timezone";
import { ScheduleGrid } from "@/features/event/grid";
import EventInfoDrawer, { EventInfo } from "@/features/event/info-drawer";
import AttendeesPanel from "@/features/event/results/attendees-panel";
import { useFormErrors } from "@/lib/hooks/use-form-errors";
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
  const userName = initialAvailabilityData.user_display_name || "";

  /* PARTICIPANT STATES */
  const participants = initialAvailabilityData.participants || [];
  const [optimisticParticipants, removeOptimisticParticipant] = useOptimistic(
    participants,
    (state, personToRemove: string) =>
      state.filter((p) => p !== personToRemove),
  );

  const availabilities = initialAvailabilityData.availability || {};
  const [optimisticAvailabilities, updateOptimisticAvailabilities] =
    useOptimistic(availabilities, (state, person: string) => {
      const updatedState = { ...state };
      for (const slot in updatedState) {
        updatedState[slot] = updatedState[slot].filter((p) => p !== person);
      }
      return updatedState;
    });

  /* HOVER HANDLING */
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  /* TIMEZONE HANDLING */
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  const handleTZChange = (newTZ: string | number) => {
    setTimezone(newTZ.toString());
  };

  /* ERROR HANDLING */
  const { handleError } = useFormErrors();

  /* SIDEBAR SPACING HANDLING */
  const DEFAULT_SPACER_HEIGHT = 200;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState(DEFAULT_SPACER_HEIGHT);

  useEffect(() => {
    if (!sidebarRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (entries.length === 0) return;
      const entry = entries[0];
      setSpacerHeight(entry.contentRect.height);
    });

    observer.observe(sidebarRef.current);

    return () => observer.disconnect();
  }, []);

  const editButton = isCreator ? (
    <LinkButton
      buttonStyle="secondary"
      icon={<Pencil1Icon />}
      label="Edit Event"
      shrinkOnMobile
      href={`/${eventCode}/edit`}
    />
  ) : null;

  const copyButton = <CopyToastButton code={eventCode} />;

  const availabilityButton = (
    <LinkButton
      buttonStyle="primary"
      icon={<Pencil2Icon />}
      label={(participated ? "Edit" : "Add") + " Availability"}
      href={`/${eventCode}/painting`}
    />
  );

  return (
    <div className="flex flex-col space-y-4 pl-6 pr-6">
      <HeaderSpacer />
      <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="flex min-w-0 items-center space-x-2 md:flex-1">
          <h1 className="max-w-full truncate text-2xl font-bold md:max-w-[50vw]">{eventName}</h1>
          <EventInfoDrawer eventRange={eventRange} />
      <div className="md:flex md:justify-between">
        <div className="flex items-center justify-between space-x-2">
          <h1 className="text-2xl">{eventName}</h1>
          <EventInfoDrawer eventRange={eventRange} timezone={timezone} />
        </div>
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {editButton}
          {copyButton}
          {availabilityButton}
        </div>
      </div>

      <div className="h-fit md:flex md:flex-row md:gap-4">
        <ScheduleGrid
          mode="view"
          isWeekdayEvent={eventRange.type === "weekday"}
          timezone={timezone}
          hoveredSlot={hoveredSlot}
          setHoveredSlot={setHoveredSlot}
          availabilities={optimisticAvailabilities}
          numParticipants={optimisticParticipants.length}
          timeslots={timeslots}
        />

        <div
          style={{ height: `${spacerHeight}px` }}
          className="w-full md:hidden"
        />

        {/* Sidebar for attendees */}
        <div
          ref={sidebarRef}
          className={cn(
            "fixed bottom-1 left-0 z-10 w-full shrink-0 px-6",
            "md:top-25 md:sticky md:h-full md:w-80 md:space-y-4 md:px-0",
          )}
        >
          <AttendeesPanel
            hoveredSlot={hoveredSlot}
            participants={optimisticParticipants}
            availabilities={optimisticAvailabilities}
            isCreator={isCreator}
            currentUser={userName}
            eventCode={eventCode}
            removeOptimisticParticipant={removeOptimisticParticipant}
            updateOptimisticAvailabilities={updateOptimisticAvailabilities}
            handleError={handleError}
          />

          <div className="bg-panel hidden rounded-3xl p-6 md:block">
            <EventInfo eventRange={eventRange} timezone={timezone} />
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

      <MobileFooterTray
        buttons={[editButton, copyButton, availabilityButton].filter(Boolean)}
      />
    </div>
  );
}
