"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";

import { AvailabilitySet } from "@/app/_lib/availability/types";
import { EventRange } from "@/app/_lib/schedule/types";
import { getUtcIsoSlot } from "@/app/_lib/availability/utils";
import { checkDateInRange } from "@/app/_lib/schedule/utils";

import TimeSlot from "./time-slot";
import useScheduleDrag from "@/app/_lib/use-schedule-drag";

interface TimeBlockProps {
  // "paint": enables drag-to-select for availability painting
  // "view": shows results
  // "preview": shows preview during event creation
  mode: "paint" | "view" | "preview";

  timeColWidth: number;
  visibleDays: string[];
  startHour: number;
  endHour: number;
  userTimezone: string;

  disableSelect?: boolean;
  availability: AvailabilitySet;
  allAvailabilities?: AvailabilitySet[];

  hoveredSlot?: string | null;
  eventRange: EventRange;

  onToggle?: (slotIso: string) => void;
  onHoverSlot?: (iso: string | null) => void;
}

export default function TimeBlock({
  mode,
  disableSelect = false,
  timeColWidth,
  startHour,
  endHour,
  visibleDays,
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

  const dragHandlers = useScheduleDrag(onToggle ?? (() => {}), mode);

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

  if (numHours <= 0 || visibleDays.length === 0) return null;

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
        className="grid w-full border border-gray-400 dark:border-gray-600"
        style={{
          gridTemplateColumns: `repeat(${visibleDays.length}, 1fr)`,
          gridTemplateRows: `repeat(${numQuarterHours}, minmax(20px, 1fr))`,
        }}
      >
        {Array.from({ length: numQuarterHours }).map((_, quarterIdx) =>
          visibleDays.map((_, dayIdx) => {
            const isDashedBorder = quarterIdx % 4 !== 0;

            const hour = startHour + Math.floor(quarterIdx / 4);
            const minute = (quarterIdx % 4) * 15;
            const dateKey = visibleDays[dayIdx];
            const { utcDate: date, isoString: slotIso } = getUtcIsoSlot(
              dateKey,
              hour,
              minute,
              userTimezone,
            );

            const isDisabled = checkDateInRange(date, eventRange) === false;

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
                key={`slot-${quarterIdx}-${dayIdx}`}
                slotIso={slotIso}
                isSelected={isSelected}
                isHovered={isHovered}
                isDisabled={isDisabled}
                disableSelect={disableSelect}
                isDashedBorder={isDashedBorder}
                backgroundColor={backgroundColor}
                gridColumn={dayIdx + 1}
                gridRow={quarterIdx + 1}
                onMouseDown={() =>
                  dragHandlers.onMouseDown(slotIso, isDisabled)
                }
                onMouseEnter={() => {
                  dragHandlers.onMouseEnter(slotIso, isDisabled);
                  if (mode === "view") onHoverSlot?.(slotIso);
                }}
                onTouchStart={() =>
                  dragHandlers.onTouchStart(slotIso, isDisabled)
                }
                onTouchMove={dragHandlers.onTouchMove}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
