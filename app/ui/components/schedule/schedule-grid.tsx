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
  function handleToggle(slotIso: string) {
    if (disableSelect) return;
    setAvailability((prev) => {
      const updated = new Set(prev);
      if (updated.has(slotIso)) {
        updated.delete(slotIso);
      } else {
        updated.add(slotIso);
      }
      if (process.env.NODE_ENV === "development") {
        console.log("Updated availability:", updated);
      }
      return updated;
    });
  }

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
    <div className="relative h-[90%] w-full">
      {/* Arrows */}
      {currentPage > 0 && (
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          className="absolute top-0 left-6 z-10 h-[50px] text-xl w-[50px]"
          aria-label="View previous days"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
      )}
      {currentPage < totalPages - 1 && (
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
          className="absolute top-0 right-0 z-10 h-[50px] text-xl w-[20px]"
          aria-label="View next days"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      )}

      {/* Grid */}
      <div
        className={`grid h-full w-full divide-x-1 divide-y-1 divide-solid divide-gray-400 grid-cols-[50px_repeat(${visibleDays.length},1fr)_20px] grid-rows-[50px_repeat(${numHours},1fr)]`}
      >
        {Array.from({
          length: (numHours + 1) * (visibleDays.length + 2) + 1,
        }).map((_, i) => (
          <div
            key={i}
            className={`${disableSelect ? "cursor-not-allowed" : ""}`}
          />
        ))}
      </div>

      {/* Time labels */}
      <div
        className={`pointer-events-none absolute top-0 bg-white dark:bg-violet w-[50px] h-full grid grid-rows-[50px_repeat(${numHours},1fr)] left-0`}
      >
        <div />
        {Array.from({ length: numHours }).map((_, i) => {
          const hour = timeRange.from
            ? new Date(timeRange.from.getTime() + i * 3600000)
            : new Date();
          const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            hour: "numeric",
            hour12: true,
          });
          return (
            <div
              key={i}
              className="relative flex items-start justify-end pr-2 text-right text-xs"
            >
              <span className="absolute -top-2">{formatter.format(hour)}</span>
            </div>
          );
        })}
      </div>

      {/* Column headers */}
      <div
        className={`absolute top-0 grid h-[50px] left-[50px] right-[20px] grid-cols-${Math.min(visibleDays.length, 7)}`}
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

      {/* Right border */}
      <div className="pointer-events-none absolute top-0 bg-white dark:bg-violet w-[20px] h-full right-0" />
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
