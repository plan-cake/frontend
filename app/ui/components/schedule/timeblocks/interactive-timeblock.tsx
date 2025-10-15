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
  onToggle: (slotIso: string) => void;
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

        let backgroundColor;
        if (isSelected) {
          backgroundColor = isDark
            ? "rgba(225, 92, 92, 1)"
            : "rgba(61, 115, 163, 1)";
        } else {
          backgroundColor = "";
        }

        return (
          <TimeSlot
            key={`slot-${timeslotIdx}`}
            slotIso={slotIso}
            cellClasses={cellClasses.join(" ")}
            isSelected={isSelected}
            isToggling={dragHandlers.draggedSlots.has(slotIso)}
            backgroundColor={backgroundColor}
            gridColumn={gridColumn}
            gridRow={gridRow}
            onPointerDown={() => dragHandlers.onPointerDown(slotIso, false)}
            onPointerEnter={() => {
              dragHandlers.onPointerEnter(slotIso, false);
            }}
            onTouchMove={dragHandlers.onTouchMove}
          />
        );
      })}
    </BaseTimeBlock>
  );
}
