import { useEffect, useRef } from "react";

import { ResultsAvailabilityMap } from "@/core/availability/types";
import {
  getGridCoordinates,
  getBaseCellClasses,
} from "@/features/event/grid/lib/timeslot-utils";
import TimeSlot from "@/features/event/grid/time-slot";
import BaseTimeBlock from "@/features/event/grid/timeblocks/base";

interface ResultsTimeBlockProps {
  timeColWidth: number;
  numQuarterHours: number;
  startHour: number;
  timeslots: Date[];
  numVisibleDays: number;
  visibleDayKeys: string[];
  hoveredSlot: string | null | undefined;

  availabilities: ResultsAvailabilityMap;
  numParticipants: number;

  userTimezone: string;
  onHoverSlot?: (iso: string | null) => void;
}

export default function ResultsTimeBlock({
  timeColWidth,
  numQuarterHours,
  startHour,
  timeslots,
  numVisibleDays,
  visibleDayKeys,
  userTimezone,
  availabilities,
  numParticipants,
  hoveredSlot,
  onHoverSlot,
}: ResultsTimeBlockProps) {
  const timeBlockRef = useRef<HTMLDivElement>(null);

  // on click outside to clear hovered slot
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timeBlockRef.current &&
        !timeBlockRef.current.contains(event.target as Node)
      ) {
        onHoverSlot?.(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onHoverSlot?.(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onHoverSlot]);

  return (
    <BaseTimeBlock
      ref={timeBlockRef}
      timeColWidth={timeColWidth}
      numQuarterHours={numQuarterHours}
      startHour={startHour}
      visibleDaysCount={numVisibleDays}
    >
      {timeslots.map((timeslot, timeslotIdx) => {
        const timeslotIso = timeslot.toISOString();

        const coords = getGridCoordinates(
          timeslot,
          visibleDayKeys,
          userTimezone,
          startHour,
        );
        if (!coords) return null;
        const { row: gridRow, column: gridColumn } = coords;

        // borders
        const cellClasses: string[] = getBaseCellClasses(
          gridRow,
          numQuarterHours,
        );
        cellClasses.push("cursor-default");

        const matchCount =
          availabilities[timeslotIso]?.length > 0
            ? availabilities[timeslotIso].length
            : 0;
        const opacity = matchCount / numParticipants || 0;
        const isHovered = hoveredSlot === timeslotIso;

        // background colors
        const opacityPercent = Math.round(opacity * 100);
        const dynamicStyle = {
          "--opacity-percent": `${opacityPercent}%`,
        };
        cellClasses.push(
          "bg-[color-mix(in_srgb,var(--color-accent)_var(--opacity-percent),var(--color-background))]",
        );

        return (
          <TimeSlot
            key={`slot-${timeslotIdx}`}
            slotIso={timeslotIso}
            cellClasses={cellClasses.join(" ")}
            isHovered={isHovered}
            gridColumn={gridColumn}
            gridRow={gridRow}
            onPointerEnter={() => {
              onHoverSlot?.(timeslotIso);
            }}
            dynamicStyle={dynamicStyle}
          />
        );
      })}
    </BaseTimeBlock>
  );
}
