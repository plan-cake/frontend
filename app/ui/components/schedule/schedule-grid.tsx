"use client";

import { useState, useMemo } from "react";

import { toZonedTime } from "date-fns-tz";
import { differenceInCalendarDays } from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import { EventRange } from "@/app/_lib/schedule/types";
import { AvailabilitySet } from "@/app/_lib/availability/types";
import { createEmptyUserAvailability } from "@/app/_lib/availability/utils";
import { expandEventRange } from "@/app/_lib/schedule/utils";
import useCheckMobile from "@/app/_lib/use-check-mobile";

import TimeBlock from "@/app/ui/components/schedule/time-block";

interface ScheduleGridProps {
  eventRange: EventRange;
  timezone: string;
  disableSelect?: boolean;
  attendees?: {
    name: string;
    availability: AvailabilitySet;
  }[];
  mode?: "paint" | "view" | "preview";

  hoveredSlot?: string | null;
  setHoveredSlot?: (slotIso: string | null) => void;
}

export default function ScheduleGrid({
  eventRange,
  timezone,
  disableSelect = false,
  attendees = [],
  mode = "preview",
  hoveredSlot,
  setHoveredSlot = () => {},
}: ScheduleGridProps) {
  const isMobile = useCheckMobile();

  const [availability, setAvailability] = useState<AvailabilitySet>(
    createEmptyUserAvailability(eventRange.type).selections,
  );

  function handleToggle(slotIso: Date) {
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

  const {
    numHours,
    numDays,
    timeBlocks,
    daySlots = [],
  } = useMemo(() => {
    const daySlots = expandEventRange(eventRange, timezone);
    console.log("userTimezone:", timezone, "daySlots:", daySlots);
    const numDaySlots = daySlots.length;
    if (numDaySlots === 0) {
      return {
        numHours: 0,
        numDays: 0,
        timeBlocks: [],
        daySlots: [],
      };
    }

    const numTimeSlotsPerDay = daySlots[0].timeslots.length;
    const localStartDate = toZonedTime(daySlots[0].timeslots[0], timezone);
    const localEndDate = toZonedTime(
      daySlots[numDaySlots - 1].timeslots[numTimeSlotsPerDay - 1],
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
    console.log({
      numDays,
      numDaySlots,
      localStartDate,
      localEndDate,
      timezone,
      daySlots,
    });

    return {
      numHours,
      numDays,
      timeBlocks,
      daySlots,
    };
  }, [eventRange, timezone]);

  const maxDaysVisible = isMobile ? 4 : 7;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(numDays / maxDaysVisible));

  const startIndex = currentPage * maxDaysVisible;
  const endIndex = Math.min(startIndex + maxDaysVisible, numDays);
  const visibleDays = daySlots.slice(startIndex, endIndex);

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
          const [weekday, month, date] = day.dayLabel.split(" ");
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
            visibleDays={visibleDays.map((d) => d.dayKey)}
            startHour={block.startHour}
            endHour={block.endHour}
            userTimezone={timezone}
            availability={availability}
            onToggle={handleToggle}
            allAvailabilities={attendees.map((a) => a.availability)}
            onHoverSlot={setHoveredSlot}
            hoveredSlot={hoveredSlot}
            eventRange={eventRange}
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
