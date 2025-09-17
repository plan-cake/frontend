"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import {
  EventRange,
  expandEventRange,
  getDateLabels,
  getDateKeys,
} from "@/app/_types/schedule-types";
import {
  AvailabilitySet,
  createEmptyUserAvailability,
} from "@/app/_types/user-availability";
import useCheckMobile from "@/app/_utils/use-check-mobile";
import { toZonedTime } from "date-fns-tz";
import { differenceInCalendarDays } from "date-fns";
import TimeBlock from "./time-block";

interface ScheduleGridProps {
  eventRange: EventRange;
  timezone: string;
  disableSelect?: boolean;
}

interface TimeBlockListType {
  startHour: number;
  endHour: number;
}

export default function ScheduleGrid({
  disableSelect = false,
  eventRange,
  timezone,
}: ScheduleGridProps) {
  const isMobile = useCheckMobile();

  const [availability, setAvailability] = useState<AvailabilitySet>(
    createEmptyUserAvailability(eventRange.type).selections,
  );
  const [togglingBlocks, setTogglingBlocks] = useState<AvailabilitySet>(
    new Set(),
  );
  const togglingBlocksRef = useRef(togglingBlocks);
  useEffect(() => {
    togglingBlocksRef.current = togglingBlocks;
  }, [togglingBlocks]);
  const [dragRange, setDragRange] = useState<[string, string] | null>(null);

  function handleDragStart(slotIso: string) {
    if (disableSelect) return;
    setDragRange([slotIso, slotIso]);
  }

  function handleDragEnter(slotIso: string) {
    if (disableSelect) return;
    setDragRange((prev) => (prev ? [prev[0], slotIso] : null));
  }

  function handleDragEnd() {
    if (disableSelect) return;
    setAvailability((prev) => {
      const updated = new Set(prev);
      togglingBlocksRef.current.forEach((slot) => {
        if (updated.has(slot)) {
          updated.delete(slot);
        } else {
          updated.add(slot);
        }
      });
      if (process.env.NODE_ENV === "development") {
        console.log("Updated availability:", updated);
      }
      return updated;
    });
    setTogglingBlocks(new Set());
    setDragRange(null);
  }

  useEffect(() => {
    if (dragRange) {
      // Separate the date and time components to get the proper grid range
      // I apologize for this ugly code but it works
      const [startBlock, endBlock] = dragRange.map((date) => new Date(date));
      let startDate = new Date(
        startBlock.getFullYear(),
        startBlock.getMonth(),
        startBlock.getDate(),
      );
      let endDate = new Date(
        endBlock.getFullYear(),
        endBlock.getMonth(),
        endBlock.getDate(),
      );
      let startTime = new Date(
        1970,
        0,
        0,
        startBlock.getHours(),
        startBlock.getMinutes(),
      );
      let endTime = new Date(
        1970,
        0,
        0,
        endBlock.getHours(),
        endBlock.getMinutes(),
      );
      if (endDate < startDate) {
        const temp = startDate;
        startDate = endDate;
        endDate = temp;
      }
      if (endTime < startTime) {
        const temp = startTime;
        startTime = endTime;
        endTime = temp;
      }

      const togglingSlots = new Set<string>();
      for (
        let date = startDate;
        date <= endDate;
        date = new Date(date.getTime() + 24 * 60 * 60 * 1000)
      ) {
        for (
          let time = startTime;
          time <= endTime;
          time = new Date(time.getTime() + 15 * 60 * 1000)
        ) {
          togglingSlots.add(
            new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              time.getHours(),
              time.getMinutes(),
            ).toISOString(),
          );
        }
      }
      setTogglingBlocks(togglingSlots);
    }
  }, [dragRange]);

  const { numHours, numDays, daysLabel, dayKeys, timeBlocks } = useMemo(() => {
    const expandedEventRange = expandEventRange(eventRange);
    const expandedRange = expandedEventRange.expandedRange;
    if (!expandedEventRange || expandedRange.length === 0) {
      return {
        numHours: 0,
        numDays: 0,
        daysLabel: [],
        dayKeys: [],
        timeBlocks: [],
      };
    }

    const localStartDate = toZonedTime(expandedRange[0].time, timezone);
    const localEndDate = toZonedTime(
      expandedRange[expandedRange.length - 1].time,
      timezone,
    );

    let localStartHour = localStartDate.getHours();
    let localEndHour = localEndDate.getHours();

    let timeBlocks: TimeBlockListType[] = [];

    if (localEndHour < localStartHour) {
      timeBlocks.push({ startHour: 0, endHour: localEndHour });
      timeBlocks.push({ startHour: localStartHour, endHour: 24 });
    } else {
      timeBlocks.push({ startHour: localStartHour, endHour: localEndHour });
    }

    const numHours = timeBlocks.reduce((acc, block) => {
      return acc + (block.endHour - block.startHour + 1);
    }, 0);

    const numDays = differenceInCalendarDays(localEndDate, localStartDate) + 1;
    const daysLabel = getDateLabels(
      localStartDate,
      localEndDate,
      eventRange.type,
    );
    const dayKeys = getDateKeys(localStartDate, localEndDate);

    return {
      numHours,
      numDays,
      daysLabel,
      dayKeys,
      timeBlocks,
    };
  }, [eventRange, timezone]);

  const maxDaysVisible = isMobile ? 4 : 7;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(numDays / maxDaysVisible));

  const startIndex = currentPage * maxDaysVisible;
  const endIndex = Math.min(startIndex + maxDaysVisible, numDays);
  const visibleDays = daysLabel.slice(startIndex, endIndex);
  const visibleDayKeys = dayKeys.slice(startIndex, endIndex);

  const timeColWidth = 50;
  const rightArrowWidth = 20;

  if (numHours <= 0) {
    return <GridError message="Invalid time range" />;
  } else if (numDays <= 0) {
    return <GridError message="Invalid or missing date range" />;
  }

  return (
    <div
      className="relative grid w-full grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr]"
      style={{ maxHeight: "90%" }}
    >
      {/* Column Headers */}
      <div style={{ width: `${timeColWidth}px` }} />
      <div
        className={`grid h-[50px] items-center transition-shadow duration-200`}
        style={{
          gridColumn: "2",
          gridTemplateColumns: `repeat(${visibleDays.length}, 1fr) auto`,
        }}
      >
        {visibleDays.map((day, i) => {
          const type = eventRange.type;
          if (type === "specific") {
            const [weekday, month, date] = day.split(" ");
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center text-sm leading-tight font-medium"
              >
                <div>{weekday}</div>
                <div>
                  {month} {date}
                </div>
              </div>
            );
          } else if (type === "weekday") {
            return (
              <div
                key={i}
                className="flex items-center justify-center text-sm font-medium"
              >
                {day.toUpperCase()}
              </div>
            );
          }
        })}

        <div className="w-[16px]" aria-hidden />
      </div>

      {/* Left Arrow */}
      {currentPage > 0 && (
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          className="absolute top-0 left-0 z-10 h-[50px] w-[50px] text-xl"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
      )}

      {/* Right Arrow */}
      {currentPage < totalPages - 1 && (
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
          className="absolute top-0 right-0 z-10 h-[50px] w-[20px] text-xl"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      )}

      {/* Grid Layer */}
      <div
        className={`col-span-2 flex flex-grow flex-col gap-4 overflow-y-auto pt-2`}
      >
        {timeBlocks?.map((block, i) => (
          <TimeBlock
            key={i}
            disableSelect={disableSelect}
            timeColWidth={timeColWidth}
            rightArrowWidth={rightArrowWidth}
            visibleDays={visibleDayKeys}
            startHour={block.startHour}
            endHour={block.endHour}
            splitBlocks={
              timeBlocks.length > 1 && block.startHour !== block.endHour
            }
            blockNumber={i}
            userTimezone={timezone}
            availability={availability}
            toggling={togglingBlocks}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
}

const GridError = ({ message }: { message: string }) => {
  return (
    <div className="flex h-full w-full items-center justify-center text-sm">
      <ExclamationTriangleIcon className="mr-2 h-5 w-5 text-red" />
      {message}
    </div>
  );
};
