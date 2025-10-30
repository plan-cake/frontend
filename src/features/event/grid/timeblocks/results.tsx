import { format, formatInTimeZone, toZonedTime } from "date-fns-tz";

import { ResultsAvailabilityMap } from "@/core/availability/types";
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
  return (
    <BaseTimeBlock
      timeColWidth={timeColWidth}
      numQuarterHours={numQuarterHours}
      startHour={startHour}
      visibleDaysCount={numVisibleDays}
    >
      {timeslots.map((timeslot, timeslotIdx) => {
        const timeslotIso = format(timeslot, "yyyy-MM-dd'T'HH:mm:ss");

        const localSlot = toZonedTime(timeslot, userTimezone);
        const localSlotIso = formatInTimeZone(
          timeslot,
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
        const cellClasses: string[] = ["cursor-default"];
        if (gridRow < numQuarterHours) {
          cellClasses.push("border-b");

          if (gridRow % 4 === 0) {
            cellClasses.push("border-solid border-gray-400");
          } else {
            cellClasses.push("border-dashed border-gray-400");
          }
        }

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
          `bg-[color-mix(in_srgb,var(--color-blue)_var(--opacity-percent),var(--color-white))] dark:bg-[color-mix(in_srgb,var(--color-red)_var(--opacity-percent),var(--color-violet))]`,
        );

        return (
          <TimeSlot
            key={`slot-${timeslotIdx}`}
            slotIso={localSlotIso}
            cellClasses={cellClasses.join(" ")}
            isHovered={isHovered}
            gridColumn={gridColumn}
            gridRow={gridRow}
            onPointerEnter={() => {
              onHoverSlot?.(localSlotIso);
            }}
            dynamicStyle={dynamicStyle}
          />
        );
      })}
    </BaseTimeBlock>
  );
}
