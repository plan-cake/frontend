"use client";

import { useState } from "react";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { toZonedTime } from "date-fns-tz";
import { AnimatePresence, motion } from "framer-motion";

import {
  AvailabilitySet,
  ResultsAvailabilityMap,
} from "@/core/availability/types";
import { createEmptyUserAvailability } from "@/core/availability/utils";
import { EventRange } from "@/core/event/types";
import {
  getBaseCellClasses,
  getGridCoordinates,
} from "@/features/event/grid/lib/timeslot-utils";
import useGenerateTimeSlots from "@/features/event/grid/lib/use-generate-timeslots";
import ScheduleHeader from "@/features/event/grid/schedule-header";
import TimeLabels from "@/features/event/grid/time-column";
import InteractiveTimeBlock from "@/features/event/grid/timeblocks/interactive";
import PreviewTimeBlock from "@/features/event/grid/timeblocks/preview";
import ResultsTimeBlock from "@/features/event/grid/timeblocks/results";
import useCheckMobile from "@/lib/hooks/use-check-mobile";

interface ScheduleGridProps {
  mode: "paint" | "view" | "preview";
  eventRange: EventRange;
  timeslots: Date[];
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

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export default function ScheduleGrid({
  eventRange,
  timeslots,
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

  const { timeBlocks, dayGroupedSlots, numDays, error } = useGenerateTimeSlots(
    eventRange,
    timeslots,
    timezone,
  );

  const maxDaysVisible = isMobile ? 4 : 7;
  const [[currentPage, direction], setCurrentPage] = useState([0, 0]);
  const totalPages = Math.max(1, Math.ceil(numDays / maxDaysVisible));

  const paginate = (newDirection: number) => {
    const nextPage = currentPage + newDirection;
    if (nextPage >= 0 && nextPage < totalPages) {
      setCurrentPage([nextPage, newDirection]);
    }
  };

  const startIndex = currentPage * maxDaysVisible;
  const endIndex = Math.min(startIndex + maxDaysVisible, numDays);

  const visibleDays = dayGroupedSlots.slice(startIndex, endIndex);
  const visibleTimeSlots = visibleDays.flatMap((day) => day.timeslots);

  if (numDays <= 0 || numDays > 30)
    return <GridError message="Invalid or missing date range" />;
  if (error) return <GridError message={error} />;

  return (
    <div
      className="relative mb-8 grid w-full grid-cols-[1fr_30px] grid-rows-[auto_1fr]"
      style={{ maxHeight: "90%" }}
    >
      <ScheduleHeader
        preview={mode === "preview"}
        visibleDays={visibleDays}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={() => paginate(-1)}
        onNextPage={() => paginate(1)}
        direction={direction}
      />

      <div className="col-span-1 flex h-full overflow-y-auto overflow-x-hidden pt-2">
        <div className="flex flex-col gap-4">
          {timeBlocks.map((block, i) => {
            const numQuarterHours = (block.endHour - block.startHour + 1) * 4;
            return (
              <TimeLabels
                key={`labels-${i}`}
                timeColWidth={50}
                numQuarterHours={numQuarterHours}
                startHour={block.startHour}
              />
            );
          })}
        </div>

        <div className="relative flex-grow">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col gap-4"
            >
              {timeBlocks.map((block, i) => {
                // filter visibleTimeSlots to those within this block's hours
                const visibleDayKeys = visibleDays.map((d) => d.dayKey);
                const numQuarterHours =
                  (block.endHour - block.startHour + 1) * 4;
                const blockTimeSlots = visibleTimeSlots
                  .filter((slot) => {
                    const localSlot = toZonedTime(slot, timezone);
                    const hour = localSlot.getHours();
                    return hour >= block.startHour && hour <= block.endHour;
                  })
                  .map((slot) => {
                    const coords = getGridCoordinates(
                      slot,
                      visibleDayKeys,
                      timezone,
                      block.startHour,
                    );

                    const cellClasses = getBaseCellClasses(
                      coords.row,
                      numQuarterHours,
                    );

                    return {
                      iso: slot.toISOString(),
                      coords,
                      cellClasses,
                    };
                  });

                const commonProps = {
                  numQuarterHours,
                  numVisibleDays: visibleDays.length,
                  timeslots: blockTimeSlots,
                };

                if (mode === "preview") {
                  return <PreviewTimeBlock key={i} {...commonProps} />;
                } else if (mode === "paint") {
                  return (
                    <InteractiveTimeBlock
                      key={i}
                      {...commonProps}
                      availability={userAvailability}
                      onToggle={onToggleSlot}
                    />
                  );
                } else if (mode === "view") {
                  return (
                    <ResultsTimeBlock
                      key={i}
                      {...commonProps}
                      hoveredSlot={hoveredSlot}
                      availabilities={availabilities}
                      numParticipants={numParticipants}
                      onHoverSlot={setHoveredSlot}
                    />
                  );
                }
              })}
            </motion.div>
          </AnimatePresence>
        </div>
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
