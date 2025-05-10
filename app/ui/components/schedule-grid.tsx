"use client";

import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import {
  EventRange,
  getDateLabels,
  getEnabledWeekdays,
} from "@/app/_types/schedule-types";
import useCheckMobile from "@/app/_utils/useCheckMobile";

interface ScheduleGridProps {
  eventRange: EventRange;
  timezone: string;
  disableSelect?: boolean;
}

export default function ScheduleGrid({
  disableSelect = false,
  eventRange,
  timezone,
}: ScheduleGridProps) {
  const isMobile = useCheckMobile();

  let numHours = 0;
  let numDays = 0;
  let daysLabel: string[] = [];

  const { timeRange } = eventRange;
  numHours =
    timeRange.to && timeRange.from
      ? timeRange.to.getHours() - timeRange.from.getHours() + 1
      : 0;

  if (eventRange.type === "specific") {
    const { dateRange } = eventRange;
    if (!dateRange || !timeRange) {
      return GridError({ message: "Invalid date or time range" });
    }

    numDays =
      Math.ceil(
        ((dateRange.to?.getTime() ?? 0) - (dateRange.from?.getTime() ?? 0)) /
          (1000 * 60 * 60 * 24),
      ) + 1;
    daysLabel = getDateLabels(dateRange);
  } else if (eventRange.type === "weekday") {
    const { weekdays } = eventRange;
    const enabledWeekdays = getEnabledWeekdays(weekdays);
    if (!enabledWeekdays || !timeRange) {
      return GridError({ message: "Invalid weekdays or time range" });
    }

    numDays = enabledWeekdays.length;
    daysLabel = enabledWeekdays.map((day) => day.toUpperCase());
  }

  const maxDaysVisible = isMobile ? 4 : 7;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(numDays / maxDaysVisible);

  const startIndex = currentPage * maxDaysVisible;
  const endIndex = Math.min(startIndex + maxDaysVisible, numDays);
  const visibleDays = Array.from(
    { length: endIndex - startIndex },
    (_, i) => daysLabel[startIndex + i],
  );

  const timeColWidth = 50;
  const rightArrowWidth = 20;

  if (numHours <= 0) {
    return GridError({ message: "Invalid time range" });
  } else if (numDays <= 0) {
    return GridError({ message: "Invalid or missing date range" });
  }

  return (
    <div className="relative h-[90%] w-full">
      {/* Arrows */}
      {currentPage > 0 && (
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          className="absolute top-0 left-6 z-10 h-[50px] text-xl"
          style={{ width: `${timeColWidth}px` }}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
      )}
      {currentPage < totalPages - 1 && (
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
          className="absolute top-0 right-0 z-10 h-[50px] text-xl"
          style={{ width: `${rightArrowWidth}px` }}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      )}

      {/* Grid */}
      <div
        className="grid h-full w-full divide-x-1 divide-y-1 divide-solid divide-gray-300 dark:divide-gray-400"
        style={{
          gridTemplateColumns: `${timeColWidth}px repeat(${visibleDays.length}, 1fr) ${rightArrowWidth}px`,
          gridTemplateRows: `50px repeat(${numHours}, 1fr)`,
        }}
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
        className="pointer-events-none absolute top-0 bg-white dark:bg-dblue"
        style={{
          width: `${timeColWidth}px`,
          height: "100%",
          display: "grid",
          gridTemplateRows: `50px repeat(${numHours}, 1fr)`,
          left: 0,
        }}
      >
        <div />
        {Array.from({ length: numHours }).map((_, i) => {
          const hour = timeRange.from
            ? new Date(timeRange.from.getTime() + i * 3600000)
            : new Date(); // Fallback to current time or handle appropriately
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
        className="absolute top-0 grid h-[50px]"
        style={{
          left: `${timeColWidth}px`,
          right: `${rightArrowWidth}px`,
          gridTemplateColumns: `repeat(${visibleDays.length}, 1fr)`,
        }}
      >
        {visibleDays.map((day, dayIndex) => {
          const type = eventRange.type;

          if (type === "specific") {
            // split the day string into date and month
            const [weekday, month, date] = day.split(" ");
            return (
              <div
                key={dayIndex}
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
                key={dayIndex}
                className="flex items-center justify-center text-sm font-medium"
              >
                {day.toUpperCase()}
              </div>
            );
          }
        })}
      </div>

      {/* Right border */}
      <div
        className="pointer-events-none absolute top-0 bg-white dark:bg-dblue"
        style={{
          width: `${rightArrowWidth}px`,
          height: "100%",
          right: 0,
        }}
      ></div>
    </div>
  );
}

const GridError = ({ message }: { message: string }) => {
  return (
    <div className="flex h-full w-full items-center justify-center text-sm">
      <ExclamationTriangleIcon className="mr-2 h-5 w-5 text-red dark:text-red-500" />
      {message}
    </div>
  );
};
