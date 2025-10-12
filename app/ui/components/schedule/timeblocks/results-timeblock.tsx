import { ResultsAvailabilityMap } from "@/app/_lib/availability/types";

import BaseTimeBlock from "./base-timeblock";

import { formatInTimeZone, toZonedTime } from "date-fns-tz";
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
        const localSlot = toZonedTime(timeslot, userTimezone);
        const localSlotIso = formatInTimeZone(
          localSlot,
          userTimezone,
          "yyyy-MM-dd'T'HH:mm:ss",
        );

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

        const matchCount =
          availabilities[localSlotIso]?.length > 0
            ? availabilities[localSlotIso].length
            : 0;
        const opacity = matchCount / numParticipants || 0;
        const isHovered = hoveredSlot === localSlotIso;

        let backgroundColor;
        backgroundColor = isDark
          ? `rgba(225, 92, 92, ${opacity})`
          : `rgba(61, 115, 163, ${opacity})`;

        return (
          <TimeSlot
            key={`slot-${timeslotIdx}`}
            slotIso={localSlotIso}
            cellClasses={cellClasses.join(" ")}
            backgroundColor={backgroundColor}
            isHovered={isHovered}
            gridColumn={gridColumn}
            gridRow={gridRow}
            onMouseEnter={() => {
              onHoverSlot?.(localSlotIso);
            }}
          />
        );
      })}
    </BaseTimeBlock>
  );
}
