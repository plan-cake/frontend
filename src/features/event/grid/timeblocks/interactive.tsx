import {
  getGridCoordinates,
  getBaseCellClasses,
} from "@/features/event/grid/lib/timeslot-utils";
import useScheduleDrag from "@/features/event/grid/lib/use-schedule-drag";
import TimeSlot from "@/features/event/grid/time-slot";
import BaseTimeBlock from "@/features/event/grid/timeblocks/base";
import { InteractiveTimeBlockProps } from "@/features/event/grid/timeblocks/props";

export default function InteractiveTimeBlock({
  numQuarterHours,
  startHour,
  timeslots,
  numVisibleDays,
  visibleDayKeys,
  userTimezone,
  availability,
  onToggle,
}: InteractiveTimeBlockProps) {
  const dragHandlers = useScheduleDrag(onToggle, "paint");

  return (
    <BaseTimeBlock
      numQuarterHours={numQuarterHours}
      visibleDaysCount={numVisibleDays}
    >
      {timeslots.map((timeslot, timeslotIdx) => {
        const slotIso = timeslot.toISOString();

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

        const isSelected = availability.has(slotIso);
        const isToggling =
          dragHandlers.draggedSlots.has(slotIso) &&
          dragHandlers.togglingOn === !isSelected;
        // don't highlight if we're toggling, in case the user is hovering a slot that
        // won't be toggled
        const isHovered =
          dragHandlers.hoveredSlot === slotIso &&
          dragHandlers.draggedSlots.size === 0;

        if (isSelected && (isHovered || isToggling)) {
          cellClasses.push(
            "bg-[color-mix(in_srgb,var(--color-accent),var(--color-white)_30%)]",
          );
        } else if (isHovered || isToggling) {
          cellClasses.push(
            "bg-[color-mix(in_srgb,var(--color-background),var(--color-accent)_40%)]",
          );
        } else if (isSelected) {
          cellClasses.push("bg-accent");
        }

        return (
          <TimeSlot
            key={`slot-${timeslotIdx}`}
            slotIso={slotIso}
            cellClasses={cellClasses.join(" ")}
            gridColumn={gridColumn}
            gridRow={gridRow}
            onPointerDown={() =>
              dragHandlers.onPointerDown(slotIso, false, isSelected)
            }
            onPointerEnter={() => {
              dragHandlers.onPointerEnter(slotIso, false);
            }}
            onPointerLeave={() => {
              dragHandlers.onPointerLeave();
            }}
            onTouchMove={dragHandlers.onTouchMove}
          />
        );
      })}
    </BaseTimeBlock>
  );
}
