"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/app/_lib/classname";

import { AvailabilitySet } from "@/app/_lib/availability/types";
import { DaySlot, EventRange } from "@/app/_lib/schedule/types";
import { getUtcIsoSlot } from "@/app/_lib/availability/utils";
import { checkDateInRange } from "@/app/_lib/schedule/utils";

import TimeSlot from "./time-slot";
import useScheduleDrag from "@/app/_lib/use-schedule-drag";
import { toZonedTime } from "date-fns-tz";
import { start } from "repl";
import { time } from "console";

interface TimeBlockProps {
  // "paint": enables drag-to-select for availability painting
  // "view": shows results
  // "preview": shows preview during event creation
  mode: "paint" | "view" | "preview";

  timeColWidth: number;
  timeslots: Date[];
  numVisibleDays: number;
  visibleDayKeys: string[];
  startHour: number;
  endHour: number;
  userTimezone: string;

  disableSelect?: boolean;
  availability: AvailabilitySet;
  allAvailabilities?: AvailabilitySet[];

  hoveredSlot?: string | null;
  eventRange: EventRange;

  onToggle?: (slotIso: Date) => void;
  onHoverSlot?: (iso: string | null) => void;
}

export default function TimeBlock({
  mode,
  disableSelect = false,
  timeColWidth,
  startHour,
  endHour,
  timeslots,
  numVisibleDays,
  visibleDayKeys,
  userTimezone,
  availability,
  onToggle,
  allAvailabilities = [],
  onHoverSlot,
  hoveredSlot,
  eventRange,
}: TimeBlockProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const dragHandlers = useScheduleDrag((slotIso: string) => {
    const date = new Date(slotIso);
    onToggle?.(date);
  }, mode);

  const numHours = endHour - startHour;
  const numQuarterHours = numHours * 4;
  const hoursLabel = useMemo(() => {
    return Array.from({ length: numQuarterHours }, (_, i) => {
      const hour24 = startHour + Math.floor(i / 4);
      const hour12 = hour24 % 12 || 12;
      const period = hour24 < 12 ? "AM" : "PM";
      return `${hour12} ${period}`;
    });
  }, [startHour, numQuarterHours]);

  return (
    <div className="flex grow flex-row">
      <div
        className="pointer-events-none"
        style={{
          width: `${timeColWidth}px`,
          display: "grid",
          gridTemplateRows: `repeat(${numQuarterHours}, minmax(20px, 1fr))`,
        }}
      >
        {Array.from({ length: numQuarterHours }).map((_, i) =>
          i % 4 === 0 ? (
            <div
              key={`label-${i}`}
              className="relative flex items-start justify-end pr-2 text-right text-xs"
            >
              <span className="absolute -top-2">{hoursLabel[i]}</span>
            </div>
          ) : (
            <div key={`empty-${i}`} />
          ),
        )}
      </div>

      <div
        className={cn(
          "dark:border-gray grid w-full divide-y divide-dashed divide-gray-400 border border-gray-400 dark:divide-gray-400",
          "bg-gray-200 dark:bg-gray-400",
        )}
        style={{
          gridTemplateColumns: `repeat(${numVisibleDays}, 1fr)`,
          gridTemplateRows: `repeat(${numQuarterHours}, minmax(20px, 1fr))`,
        }}
      >
        {timeslots.map((timeslot, timeslotIdx) => {
          const slotIso = timeslot.toISOString();
          const localSlot = toZonedTime(timeslot, userTimezone);

          const currentDayKey = localSlot.toLocaleDateString("en-CA");
          const dayIndex = visibleDayKeys.indexOf(currentDayKey);
          if (dayIndex === -1) return null;

          const gridColumn = dayIndex + 1;
          const gridRow =
            (localSlot.getHours() - startHour) * 4 +
            Math.floor(localSlot.getMinutes() / 15) +
            1;

          if (
            localSlot.getHours() < startHour ||
            localSlot.getHours() >= endHour
          ) {
            return null;
          }

          const matchCount = allAvailabilities.reduce(
            (acc, set) => acc + (set.has(slotIso) ? 1 : 0),
            0,
          );
          const total = allAvailabilities.length || 1;
          const opacity = matchCount / total;
          const isHovered = hoveredSlot === slotIso;
          const isSelected = availability.has(slotIso);

          const backgroundColor =
            mode === "view"
              ? isDark
                ? opacity === 1
                  ? `rgb(226, 0, 0)`
                  : `rgba(225, 92, 92, ${opacity})`
                : opacity === 1
                  ? `rgb(0, 107, 188)`
                  : `rgba(61, 115, 163, ${opacity})`
              : isSelected
                ? isDark
                  ? "rgba(225, 92, 92, 1)"
                  : "rgba(61, 115, 163, 1)"
                : "transparent";

          return (
            <TimeSlot
              key={`slot-${timeslotIdx}`}
              slotIso={slotIso}
              isSelected={isSelected}
              isHovered={isHovered}
              disableSelect={disableSelect}
              backgroundColor={backgroundColor}
              gridColumn={gridColumn}
              gridRow={gridRow}
              onMouseDown={() => dragHandlers.onMouseDown(slotIso, true)}
              onMouseEnter={() => {
                dragHandlers.onMouseEnter(slotIso, true);
                if (mode === "view") onHoverSlot?.(slotIso);
              }}
              onTouchStart={() => dragHandlers.onTouchStart(slotIso, true)}
              onTouchMove={dragHandlers.onTouchMove}
            />
          );
        })}
      </div>
    </div>
  );
}
