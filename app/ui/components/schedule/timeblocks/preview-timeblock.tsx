import BaseTimeBlock from "./base-timeblock";

import { toZonedTime } from "date-fns-tz";
import { useTheme } from "next-themes";
import TimeSlot from "../time-slot";

interface PreviewTimeBlockProps {
  timeColWidth: number;
  numQuarterHours: number;
  startHour: number;
  timeslots: Date[];
  numVisibleDays: number;
  visibleDayKeys: string[];

  userTimezone: string;
}

export default function PreviewTimeBlock({
  timeColWidth,
  numQuarterHours,
  startHour,
  timeslots,
  numVisibleDays,
  visibleDayKeys,
  userTimezone,
}: PreviewTimeBlockProps) {
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

        return (
          <TimeSlot
            key={`slot-${timeslotIdx}`}
            slotIso={slotIso}
            disableSelect={true}
            cellClasses={cellClasses.join(" ")}
            gridColumn={gridColumn}
            gridRow={gridRow}
          />
        );
      })}
    </BaseTimeBlock>
  );
}
