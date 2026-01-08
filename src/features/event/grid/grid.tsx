"use client";

import { useState } from "react";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { toZonedTime } from "date-fns-tz";

import {
  AvailabilitySet,
  ResultsAvailabilityMap,
} from "@/core/availability/types";
import { createEmptyUserAvailability } from "@/core/availability/utils";
import { EventRange } from "@/core/event/types";
import useGenerateTimeSlots from "@/features/event/grid/lib/use-generate-timeslots";
import ScheduleHeader from "@/features/event/grid/schedule-header";
import InteractiveTimeBlock from "@/features/event/grid/timeblocks/interactive";
import PreviewTimeBlock from "@/features/event/grid/timeblocks/preview";
import ResultsTimeBlock from "@/features/event/grid/timeblocks/results";
import useCheckMobile from "@/lib/hooks/use-check-mobile";

interface ScheduleGridProps {
  mode: "paint" | "view" | "preview";
  eventRange: EventRange;
  timezone: string;

  disableSelect?: boolean;

  // for "view" mode
  availabilities?: ResultsAvailabilityMap;
  numParticipants?: number;
  hoveredSlot?: string | null;
  setHoveredSlot?: (slotIso: string | null) => void;

  // for "paint" mode
  userAvailability?: AvailabilitySet;
  onToggleSlot?: (slotIso: string, togglingOn: boolean) => void;
}

export default function ScheduleGrid({
  eventRange,
  timezone,
  mode = "preview",
  availabilities = {},
  numParticipants = 0,
  hoveredSlot,
  setHoveredSlot = () => {},
  userAvailability = createEmptyUserAvailability(),
  onToggleSlot = () => {},
}: ScheduleGridProps) {
  const isMobile = useCheckMobile();

  const { timeBlocks, daySlots, numDays, error } = useGenerateTimeSlots(
    eventRange,
    timezone,
  );

  const maxDaysVisible = isMobile ? 4 : 7;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(numDays / maxDaysVisible));

  const startIndex = currentPage * maxDaysVisible;
  const endIndex = Math.min(startIndex + maxDaysVisible, numDays);

  if (!daySlots || numDays <= 0 || numDays > 30)
    return <GridError message="Invalid or missing date range" />;
  if (error) return <GridError message={error} />;

  const visibleDays = daySlots.slice(startIndex, endIndex);
  const visibleTimeSlots = visibleDays.flatMap((day) => day.timeslots);

  return (
    <div
      className="relative mb-8 grid w-full grid-cols-[1fr_20px] grid-rows-[auto_1fr]"
      style={{ maxHeight: "90%" }}
    >
      <ScheduleHeader
        preview={mode === "preview"}
        visibleDays={visibleDays}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={() => setCurrentPage((p) => Math.max(p - 1, 0))}
        onNextPage={() =>
          setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
        }
      />

      <div className="flex flex-grow flex-col gap-4 overflow-y-auto pt-2">
        {timeBlocks.map((block, i) => {
          // filter visibleTimeSlots to those within this block's hours
          const blockTimeSlots = visibleTimeSlots.filter((slot) => {
            const localSlot = toZonedTime(slot, timezone);
            const hour = localSlot.getHours();
            return hour >= block.startHour && hour <= block.endHour;
          });

          const numQuarterHours = (block.endHour - block.startHour + 1) * 4;

          if (mode === "preview") {
            return (
              <PreviewTimeBlock
                key={i}
                timeColWidth={50}
                numQuarterHours={numQuarterHours}
                startHour={block.startHour}
                timeslots={blockTimeSlots}
                numVisibleDays={visibleDays.length}
                visibleDayKeys={visibleDays.map((d) => d.dayKey)}
                userTimezone={timezone}
              />
            );
          } else if (mode === "paint") {
            return (
              <InteractiveTimeBlock
                key={i}
                timeColWidth={50}
                numQuarterHours={numQuarterHours}
                startHour={block.startHour}
                timeslots={blockTimeSlots}
                numVisibleDays={visibleDays.length}
                visibleDayKeys={visibleDays.map((d) => d.dayKey)}
                userTimezone={timezone}
                availability={userAvailability}
                onToggle={onToggleSlot}
              />
            );
          } else if (mode === "view") {
            return (
              <ResultsTimeBlock
                key={i}
                timeColWidth={50}
                numQuarterHours={numQuarterHours}
                startHour={block.startHour}
                timeslots={blockTimeSlots}
                numVisibleDays={visibleDays.length}
                visibleDayKeys={visibleDays.map((d) => d.dayKey)}
                userTimezone={timezone}
                hoveredSlot={hoveredSlot}
                availabilities={availabilities}
                numParticipants={numParticipants}
                onHoverSlot={setHoveredSlot}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

const GridError = ({ message }: { message: string }) => (
  <div className="flex h-full w-full items-center justify-center text-sm">
    <ExclamationTriangleIcon className="text-red mr-2 h-5 w-5" />
    {message}
  </div>
);
