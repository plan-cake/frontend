import { toZonedTime } from "date-fns-tz";

/*
 * Gets the grid coordinates (row and column) for a given
 * timeslot within the schedule grid.
 */
export function getGridCoordinates(
  slot: Date,
  visibleDayKeys: string[],
  userTimezone: string,
  startHour: number,
): { row: number; column: number } | null {
  const localSlot = toZonedTime(slot, userTimezone);
  const dayKey = localSlot.toLocaleDateString("en-CA");
  const dayIndex = visibleDayKeys.indexOf(dayKey);

  if (dayIndex === -1) {
    return null;
  }

  const hours = localSlot.getHours();
  const minutes = localSlot.getMinutes();
  const row = (hours - startHour) * 4 + Math.floor(minutes / 15) + 1; // +1 for 1-based index
  const column = dayIndex + 1; // +1 for 1-based index

  return { row, column };
}

/*
 * Determines the base CSS classes for a timeslot cell
 * based on its grid row and total number of quarter hours.
 */
export function getBaseCellClasses(
  gridRow: number,
  numQuarterHours: number,
): string[] {
  const cellClasses: string[] = [];
  if (gridRow < numQuarterHours) {
    cellClasses.push("border-b");

    if (gridRow % 4 === 0) {
      cellClasses.push("border-solid border-foreground/75");
    } else {
      cellClasses.push("border-dashed border-foreground/75");
    }
  }
  return cellClasses;
}
