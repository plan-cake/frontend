import {
  getGridCoordinates,
  getBaseCellClasses,
} from "@/features/event/grid/lib/timeslot-utils";
import TimeSlot from "@/features/event/grid/time-slot";
import BaseTimeBlock from "@/features/event/grid/timeblocks/base";
import { PreviewTimeBlockProps } from "@/features/event/grid/timeblocks/props";

export default function PreviewTimeBlock({
  numQuarterHours,
  startHour,
  timeslots,
  numVisibleDays,
  visibleDayKeys,
  userTimezone,
}: PreviewTimeBlockProps) {
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
