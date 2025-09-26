"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";

import { AvailabilitySet } from "@/app/_lib/availability/types";
import { DaySlot, EventRange } from "@/app/_lib/schedule/types";

import TimeSlot from "./time-slot";
import useScheduleDrag from "@/app/_lib/use-schedule-drag";
import { toZonedTime } from "date-fns-tz";

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
        className="grid w-full gap-x-[1px] border border-gray-400 bg-gray-400 dark:divide-gray-600 dark:border-gray-600"
        style={{
          gridTemplateColumns: `repeat(${numVisibleDays}, 1fr)`,
          gridTemplateRows: `repeat(${numQuarterHours}, minmax(20px, 1fr))`,
        }}
      >
        {timeslots.map((timeslot, timeslotIdx) => {
          const slotIso = timeslot.toISOString();
          const localSlot = toZonedTime(timeslot, userTimezone);

          if (
            localSlot.getHours() < startHour ||
            localSlot.getHours() >= endHour
          ) {
            return null;
          }

          const currentDayKey = localSlot.toLocaleDateString("en-CA");
          const dayIndex = visibleDayKeys.indexOf(currentDayKey);
          if (dayIndex === -1) return null;

          const gridColumn = dayIndex + 1;
          const gridRow =
            (localSlot.getHours() - startHour) * 4 +
            Math.floor(localSlot.getMinutes() / 15) +
            1;

          // borders
          const cellClasses: string[] = [];
          if (gridRow < numQuarterHours) {
            cellClasses.push("border-b");

            if (gridRow % 4 === 0) {
              cellClasses.push("border-solid border-gray-400");
            } else {
              cellClasses.push("border-dashed border-gray-400");
            }
          }

          const matchCount = allAvailabilities.reduce(
            (acc, set) => acc + (set.has(slotIso) ? 1 : 0),
            0,
          );
          const total = allAvailabilities.length || 1;
          const opacity = matchCount / total;
          const isHovered = hoveredSlot === slotIso;
          const isSelected = availability.has(slotIso);

          let backgroundColor;
          if (mode === "view") {
            backgroundColor = isDark
              ? `rgba(225, 92, 92, ${opacity})`
              : `rgba(61, 115, 163, ${opacity})`;
          } else {
            if (isSelected) {
              backgroundColor = isDark
                ? "rgba(225, 92, 92, 1)"
                : "rgba(61, 115, 163, 1)";
            } else if (isHovered && !disableSelect) {
              backgroundColor = isDark
                ? "rgba(225, 92, 92, 0.5)"
                : "rgba(61, 115, 163, 0.5)";
            } else {
              backgroundColor = isDark ? "rgb(31 41 55)" : "rgb(255 255 255)";
            }
          }

          return (
            <TimeSlot
              key={`slot-${timeslotIdx}`}
              slotIso={slotIso}
              cellClasses={cellClasses.join(" ")}
              isSelected={isSelected}
              isHovered={isHovered}
              disableSelect={disableSelect}
              backgroundColor={backgroundColor}
              gridColumn={gridColumn}
              gridRow={gridRow}
              onMouseDown={() => dragHandlers.onMouseDown(slotIso, false)}
              onMouseEnter={() => {
                dragHandlers.onMouseEnter(slotIso, false);
                if (mode === "view") onHoverSlot?.(slotIso);
              }}
              onTouchStart={() => dragHandlers.onTouchStart(slotIso, false)}
              onTouchMove={dragHandlers.onTouchMove}
            />
          );
        })}
      </div>
    </div>
  );
}
