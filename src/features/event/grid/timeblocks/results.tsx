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
}: ResultsTimeBlockProps) {
  return (
    <BaseTimeBlock
      numQuarterHours={numQuarterHours}
      visibleDaysCount={numVisibleDays}
    >
      {timeslots.map(({ iso, coords, cellClasses }) => {
        if (!coords) return null;
        const { row: gridRow, column: gridColumn } = coords;

        // borders
        cellClasses.push("cursor-default");

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
