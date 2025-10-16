import { AvailabilitySet } from "@/app/_lib/availability/types";

import useScheduleDrag from "@/app/_lib/use-schedule-drag";
import BaseTimeBlock from "./base-timeblock";

import { toZonedTime } from "date-fns-tz";
import { useTheme } from "next-themes";
import TimeSlot from "../time-slot";

interface InteractiveTimeBlockProps {
  timeColWidth: number;
  numQuarterHours: number;
  startHour: number;
  timeslots: Date[];
  numVisibleDays: number;
  visibleDayKeys: string[];

  userTimezone: string;
  availability: AvailabilitySet;
  onToggle: (slotIso: string, togglingOn: boolean) => void;
}

export default function InteractiveTimeBlock({
  timeColWidth,
  numQuarterHours,
  startHour,
  timeslots,
  numVisibleDays,
  visibleDayKeys,
  userTimezone,
  availability,
  onToggle,
}: InteractiveTimeBlockProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const dragHandlers = useScheduleDrag(onToggle, "paint");

  return (
    <BaseTimeBlock
      timeColWidth={timeColWidth}
      numQuarterHours={numQuarterHours}
      startHour={startHour}
      visibleDaysCount={numVisibleDays}
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

        const isSelected = availability.has(slotIso);
        const isToggling =
          dragHandlers.draggedSlots.has(slotIso) &&
          dragHandlers.togglingOn === !isSelected;
        // don't highlight if we're toggling, in case the user is hovering a slot that
        // won't be toggled
        const isHovered =
          dragHandlers.hoveredSlot === slotIso &&
          dragHandlers.draggedSlots.size === 0;

        let backgroundColor;
        if (isHovered || isToggling) {
          backgroundColor = isDark
            ? "var(--color-red-200)"
            : "var(--color-blue-200)";
        } else if (isSelected) {
          backgroundColor = isDark ? "var(--color-red)" : "var(--color-blue)";
        } else {
          backgroundColor = "";
        }

        return (
          <TimeSlot
            key={`slot-${timeslotIdx}`}
            slotIso={slotIso}
            cellClasses={cellClasses.join(" ")}
            isSelected={isSelected}
            backgroundColor={backgroundColor}
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
