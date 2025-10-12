"use client";

import { useState } from "react";

import { toZonedTime } from "date-fns-tz";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { EventRange } from "@/app/_lib/schedule/types";
import { AvailabilitySet } from "@/app/_lib/availability/types";
import { createEmptyUserAvailability } from "@/app/_lib/availability/utils";
import useCheckMobile from "@/app/_lib/use-check-mobile";
import useGenerateTimeSlots from "@/app/_lib/use-generate-timeslots";

import ScheduleHeader from "./schedule-header";
import PreviewTimeBlock from "./timeblocks/preview-timeblock";
import InteractiveTimeBlock from "./timeblocks/interactive-timeblock";
import ResultsTimeBlock from "./timeblocks/results-timeblock";

interface ScheduleGridProps {
  mode: "paint" | "view" | "preview";
  eventRange: EventRange;
  timezone: string;

  disableSelect?: boolean;
  attendees?: {
    name: string;
    availability: AvailabilitySet;
  }[];

  // for "view" mode
  hoveredSlot?: string | null;
  setHoveredSlot?: (slotIso: string | null) => void;

  // for "paint" mode
  userAvailability?: AvailabilitySet;
  onToggleSlot?: (slotIso: string) => void;
}

export default function ScheduleGrid({
  eventRange,
  timezone,
  disableSelect = false,
  attendees = [],
  mode = "preview",
  hoveredSlot,
  setHoveredSlot = () => {},
  userAvailability = createEmptyUserAvailability(),
  onToggleSlot = () => {},
}: ScheduleGridProps) {
  const isMobile = useCheckMobile();

  const { timeBlocks, dayGroupedSlots, numDays, numHours, error } =
    useGenerateTimeSlots(eventRange, timezone);

  const maxDaysVisible = isMobile ? 4 : 7;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(numDays / maxDaysVisible));

  const startIndex = currentPage * maxDaysVisible;
  const endIndex = Math.min(startIndex + maxDaysVisible, numDays);

  const visibleDays = dayGroupedSlots.slice(startIndex, endIndex);
  const visibleTimeSlots = visibleDays.flatMap((day) => day.timeslots);

  if (numDays <= 0)
    return <GridError message="Invalid or missing date range" />;
  if (error) return <GridError message={error} />;

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
                allAvailabilities={attendees.map((a) => a.availability)}
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
    <ExclamationTriangleIcon className="mr-2 h-5 w-5 text-red" />
    {message}
  </div>
);
