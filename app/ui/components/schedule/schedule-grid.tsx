"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import {
  EventRange,
  expandEventRange,
  getDateLabels,
} from "@/app/_types/schedule-types";
import useCheckMobile from "@/app/_utils/use-check-mobile";
import { toZonedTime } from "date-fns-tz";
import { differenceInCalendarDays } from "date-fns";

interface ScheduleGridProps {
  eventRange: EventRange;
  timezone: string;
  disableSelect?: boolean;
}

export default function ScheduleGrid({
  disableSelect = false,
  eventRange,
  timezone, // current timezone of the user, not necessarily the original
}: ScheduleGridProps) {
  const isMobile = useCheckMobile();

  const {
    UTCTimeSlots,
    numHours,
    hourBreakEnd,
    hourBreakStart,
    numDays,
    daysLabel,
    hoursLabel,
  } = useMemo(() => {
    const expandedEventRange = expandEventRange(eventRange);
    const expandedRange = expandedEventRange.expandedRange;
    if (!expandedEventRange || expandedRange.length === 0) {
      return {
        UTCTimeSlots: [],
        numHours: 0,
        numDays: 0,
        hourBreakEnd: -1,
        hourBreakStart: -1,
        daysLabel: [],
        hoursLabel: [],
      };
    }

    const localStartDate = toZonedTime(expandedRange[0].time, timezone);
    const localEndDate = toZonedTime(
      expandedRange[expandedRange.length - 1].time,
      timezone,
    );

    let localStartHour = localStartDate.getHours();
    let localEndHour = localEndDate.getHours();

    let hourBreakStart = -1.25;
    let hourBreakEnd = -1;

    if (localEndHour < localStartHour) {
      hourBreakStart = localEndHour + 1;
      hourBreakEnd = localStartHour;

      localStartHour = 0;
      localEndHour = 23;
    }

    const numDays = differenceInCalendarDays(localEndDate, localStartDate) + 1;
    const daysLabel = getDateLabels(localStartDate, localEndDate);
    const hoursLabel = Array.from(
      { length: (localEndHour - localStartHour + 1) * 4 },
      (_, i) => {
        const hour24 = localStartHour + Math.floor(i / 4);
        const hour12 = hour24 % 12 || 12; // Convert to 12-hour format
        const period = hour24 < 12 ? "AM" : "PM";
        return `${hour12} ${period}`;
      },
    );
    const numHours =
      hoursLabel.length - (hourBreakEnd - hourBreakStart) * 4 + 1;

    return {
      expandedRange,
      numHours,
      hourBreakEnd,
      hourBreakStart,
      numDays,
      daysLabel,
      hoursLabel,
    };
  }, [eventRange, timezone]);

  const maxDaysVisible = isMobile ? 4 : 7;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(numDays / maxDaysVisible);

  const startIndex = currentPage * maxDaysVisible;
  const endIndex = Math.min(startIndex + maxDaysVisible, numDays);
  const visibleDays = daysLabel.slice(startIndex, endIndex);

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
        className="grid h-full w-full divide-x-1 divide-y-1 divide-solid divide-gray-400"
        style={{
          gridTemplateColumns: `${timeColWidth}px repeat(${visibleDays.length}, 1fr) ${rightArrowWidth}px`,
          gridTemplateRows: `50px repeat(${numHours}, minmax(15px, 1fr))`,
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

        {hourBreakEnd > -1 && hourBreakStart > -1 && (
          <div
            className="pointer-events-none col-span-full border-b-2 border-gray-300 opacity-60"
            style={{
              gridRowStart: hourBreakStart * 4 + 2, // +2 because row 1 = header, row 2 = first slot
              gridRowEnd: hourBreakStart * 4 + 3,
            }}
          ></div>
        )}
      </div>

      {/* Time labels */}
      <div
        className="pointer-events-none absolute top-0 bg-white dark:bg-violet"
        style={{
          width: `${timeColWidth}px`,
          height: "100%",
          display: "grid",
          gridTemplateRows: `50px repeat(${numHours}, minmax(15px, 1fr))`,
          left: 0,
        }}
      >
        <div />
        {hoursLabel.map((hour, i) => {
          if (i === hourBreakStart * 4) {
            return (
              <div
                key={i}
                className="flex items-start justify-end pr-2 text-right text-xs"
              ></div>
            );
          } else if (i >= hourBreakStart * 4 && i < hourBreakEnd * 4) {
            return null;
          } else if (i % 4 === 0) {
            return (
              <div
                key={i}
                className="relative flex items-start justify-end pr-2 text-right text-xs"
              >
                <span className="absolute -top-2">{hour}</span>
              </div>
            );
          } else {
            return (
              <div
                key={i}
                className="flex items-start justify-end pr-2 text-right text-xs"
              ></div>
            );
          }
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
        className="pointer-events-none absolute top-0 bg-white dark:bg-violet"
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
      <ExclamationTriangleIcon className="mr-2 h-5 w-5 text-red" />
      {message}
    </div>
  );
};
