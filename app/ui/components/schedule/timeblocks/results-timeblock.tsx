import { AvailabilitySet } from "@/app/_lib/availability/types";

import BaseTimeBlock from "./base-timeblock";

import { toZonedTime } from "date-fns-tz";
import { useTheme } from "next-themes";
import TimeSlot from "../time-slot";

interface ResultsTimeBlockProps {
  timeColWidth: number;
  numQuarterHours: number;
  startHour: number;
  timeslots: Date[];
  numVisibleDays: number;
  visibleDayKeys: string[];
  hoveredSlot: string | null | undefined;

  allAvailabilities?: AvailabilitySet[];

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
  allAvailabilities = [],
  hoveredSlot,
  onHoverSlot,
}: ResultsTimeBlockProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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

        // REPLACE THIS WITH API DATA !!!!!!!!!
        const matchCount = allAvailabilities.reduce(
          (acc, set) => acc + (set.has(slotIso) ? 1 : 0),
          0,
        );
        const total = allAvailabilities.length || 1;
        const opacity = matchCount / total;
        const isHovered = hoveredSlot === slotIso;

        let backgroundColor;
        backgroundColor = isDark
          ? `rgba(225, 92, 92, ${opacity})`
          : `rgba(61, 115, 163, ${opacity})`;

        return (
          <TimeSlot
            key={`slot-${timeslotIdx}`}
            slotIso={slotIso}
            cellClasses={cellClasses.join(" ")}
            backgroundColor={backgroundColor}
            isHovered={isHovered}
            gridColumn={gridColumn}
            gridRow={gridRow}
            onMouseEnter={() => {
              onHoverSlot?.(slotIso);
            }}
          />
        );
      })}
    </BaseTimeBlock>
  );
}
