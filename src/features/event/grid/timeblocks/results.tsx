import {
  getGridCoordinates,
  getBaseCellClasses,
} from "@/features/event/grid/lib/timeslot-utils";
import TimeSlot from "@/features/event/grid/time-slot";
import BaseTimeBlock from "@/features/event/grid/timeblocks/base";
import { ResultsTimeBlockProps } from "@/features/event/grid/timeblocks/props";

export default function ResultsTimeBlock({
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
  return (
    <BaseTimeBlock
      numQuarterHours={numQuarterHours}
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
