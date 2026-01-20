import { useEffect, useRef } from "react";

import TimeSlot from "@/features/event/grid/time-slot";
import BaseTimeBlock from "@/features/event/grid/timeblocks/base";
import { ResultsTimeBlockProps } from "@/features/event/grid/timeblocks/props";

export default function ResultsTimeBlock({
  numQuarterHours,
  timeslots,
  numVisibleDays,
  availabilities,
  numParticipants,
  hoveredSlot,
  onHoverSlot,
  hasNext = false,
  hasPrev = false,
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
      numQuarterHours={numQuarterHours}
      visibleDaysCount={numVisibleDays}
      hasNext={hasNext}
      hasPrev={hasPrev}
    >
      {timeslots.map(({ iso, coords, cellClasses: baseClasses }) => {
        const { row: gridRow, column: gridColumn } = coords;

        // borders
        const cellClasses = [...baseClasses, "cursor-pointer"];

        const matchCount =
          availabilities[iso]?.length > 0 ? availabilities[iso].length : 0;
        const opacity = matchCount / numParticipants || 0;
        const isHovered = hoveredSlot === iso;

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
            key={iso}
            slotIso={iso}
            cellClasses={cellClasses.join(" ")}
            isHovered={isHovered}
            gridColumn={gridColumn}
            gridRow={gridRow}
            onPointerEnter={() => {
              onHoverSlot?.(iso);
            }}
            dynamicStyle={dynamicStyle}
          />
        );
      })}
    </BaseTimeBlock>
  );
}
