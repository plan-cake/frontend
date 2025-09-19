"use client";

import { useState, useMemo, useEffect, useRef, use } from "react";
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
  const [hlStart, setHlStart] = useState<string | null>(null);
  const [hlEnd, setHlEnd] = useState<string | null>(null);
  const hlEndRef = useRef<string | null>(null);
  useEffect(() => {
    hlEndRef.current = hlEnd;
  }, [hlEnd]);
  const isToggling = useRef<boolean>(true);
  const lastToggled = useRef<string | null>(null);
  const lastToggledStatus = useRef<boolean>(false);
  const currentHover = useRef<string | null>(null);
  const [isShifting, setIsShifting] = useState(false);
  const isShiftHighlighting = useRef(false);
  const highlightsRef = useRef<AvailabilitySet>(new Set());

  function handleClick(toggled: boolean, slotIso: string) {
    if (disableSelect) return;
    if (lastToggled.current && isShifting) return;
    setHlStart(slotIso);
    setHlEnd(slotIso);
    isToggling.current = !toggled;
  }

  function handleHover(slotIso: string) {
    if (disableSelect) return;
    currentHover.current = slotIso;
    if (!hlStart) return;
    setHlEnd(slotIso);
  }

  function handleRelease() {
    if (disableSelect) return;
    setAvailability((prev) => {
      let updated = prev;
      if (isToggling.current) {
        updated = new Set([...prev, ...highlightsRef.current]);
      } else {
        updated = new Set(
          [...prev].filter((slot) => !highlightsRef.current.has(slot)),
        );
      }
      return updated;
    });
    lastToggled.current = hlEndRef.current;
    lastToggledStatus.current = isToggling.current;
    setHlStart(null);
    setHlEnd(null);
  }

  // Track Shift key status
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShifting(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShifting(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Handle Shift key status changes
  useEffect(() => {
    if (isShifting) {
      if (hlEndRef.current) return;
      if (!lastToggled.current) return;
      setHlStart(lastToggled.current);
      setHlEnd(currentHover.current);
      isShiftHighlighting.current = true;
    } else {
      if (!isShiftHighlighting.current) return;
      isShiftHighlighting.current = false;
      setHlStart(null);
      setHlEnd(null);
    }
  }, [isShifting]);

  const highlights = useMemo(() => {
    if (!hlStart) {
      return new Set<string>();
    } else if (!hlEnd || hlStart === hlEnd) {
      return new Set<string>([hlStart]);
    }
    const [start, end] = [new Date(hlStart), new Date(hlEnd)];
    let startDate = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );
    let endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    let startTime = new Date(1970, 0, 0, start.getHours(), start.getMinutes());
    let endTime = new Date(1970, 0, 0, end.getHours(), end.getMinutes());
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

    const togglingBlocks = new Set<string>();
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
        togglingBlocks.add(
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
    return togglingBlocks;
  }, [hlStart, hlEnd]);
  useEffect(() => {
    highlightsRef.current = highlights;
  }, [hlStart, hlEnd]);

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
            highlights={highlights}
            onClick={handleClick}
            onHover={handleHover}
            onRelease={handleRelease}
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
