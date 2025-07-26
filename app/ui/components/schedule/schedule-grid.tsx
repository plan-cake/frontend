"use client";

import { useState, useMemo } from "react";
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
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import TimeBlock from "./time-block";

interface ScheduleGridProps {
  eventRange: EventRange;
  timezone: string;
  disableSelect?: boolean;
  attendees?: {
    name: string;
    availability: AvailabilitySet;
  }[];
  mode: "paint" | "view";

  hoveredSlot?: string | null;
  setHoveredSlot?: (slotIso: string | null) => void;
}

export default function ScheduleGrid({
  eventRange,
  timezone,
  disableSelect = false,
  attendees = [],
  mode,
  hoveredSlot,
  setHoveredSlot = () => {},
}: ScheduleGridProps) {
  const isMobile = useCheckMobile();

  const [availability, setAvailability] = useState<AvailabilitySet>(
    createEmptyUserAvailability(eventRange.type).selections,
  );

  function handleToggle(slotIso: string) {
    if (disableSelect || mode !== "paint") return;
    setAvailability((prev) => {
      const updated = new Set(prev);
      if (updated.has(slotIso)) {
        updated.delete(slotIso);
      } else {
        updated.add(slotIso);
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

    let timeBlocks = [];

    if (localEndHour < localStartHour) {
      timeBlocks.push({ startHour: 0, endHour: localEndHour });
      timeBlocks.push({ startHour: localStartHour, endHour: 24 });
    } else {
      timeBlocks.push({ startHour: localStartHour, endHour: localEndHour });
    }

    const numHours = timeBlocks.reduce(
      (acc, block) => acc + (block.endHour - block.startHour + 1),
      0,
    );

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

  if (numHours <= 0) return <GridError message="Invalid time range" />;
  if (numDays <= 0)
    return <GridError message="Invalid or missing date range" />;

  return (
    <div
      className="relative mb-8 grid w-full grid-cols-[1fr_20px] grid-rows-[auto_1fr]"
      style={{ maxHeight: "90%" }}
    >
      <div
        className="sticky top-0 z-10 col-span-2 grid h-[50px] w-full items-center bg-white dark:bg-violet"
        style={{
          gridTemplateColumns: `auto repeat(${visibleDays.length}, 1fr) auto`,
        }}
      >
        {currentPage > 0 ? (
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
            className="flex h-[50px] w-[50px] items-center justify-center text-xl"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        ) : (
          <div style={{ width: "50px" }} />
        )}

        {visibleDays.map((day, i) => {
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
        })}

        {currentPage < totalPages - 1 ? (
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
            }
            className="h-[50px] w-[20px] text-xl"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        ) : (
          <div style={{ width: "20px" }} />
        )}
      </div>

      <div className="flex flex-grow flex-col gap-4 overflow-y-auto pt-2">
        {timeBlocks.map((block, i) => (
          <TimeBlock
            key={i}
            mode={mode}
            disableSelect={disableSelect}
            timeColWidth={50}
            rightArrowWidth={20}
            visibleDays={visibleDayKeys}
            startHour={block.startHour}
            endHour={block.endHour}
            splitBlocks={timeBlocks.length > 1}
            blockNumber={i}
            userTimezone={timezone}
            availability={availability}
            onToggle={handleToggle}
            allAvailabilities={attendees.map((a) => a.availability)}
            onHoverSlot={setHoveredSlot}
            hoveredSlot={hoveredSlot}
          />
        ))}
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
