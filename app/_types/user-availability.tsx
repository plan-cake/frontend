import { fromZonedTime } from "date-fns-tz";

// keys are either weekdays or specific date strings:
//    for specific days:  "2025-05-10"
//    for weekdays: "Mon", "Tue", etc.
// values are sets timeslots where the user is available
export type AvailabilitySet = Set<string>; // each string = ISO UTC datetime (start of timeslot)

export type UserAvailability = {
  type: "specific" | "weekday";
  selections: AvailabilitySet;
};

export class DragRangeInfo {
  startSlot: string | null;
  toggling: boolean | null; // true = selecting, false = deselecting
  endSlot: string | null;
  slots: Set<string> = new Set();

  static empty() {
    return new DragRangeInfo(null, null, null);
  }

  constructor(
    startSlot: string | null,
    toggling: boolean | null,
    endSlot: string | null,
  ) {
    this.startSlot = startSlot;
    this.toggling = toggling;
    this.endSlot = endSlot;
    this.slots = this.blocks;
  }

  private get blocks(): Set<string> {
    if (!this.startSlot || !this.endSlot || this.toggling === null) {
      return new Set<string>();
    }
    const [start, end] = [new Date(this.startSlot), new Date(this.endSlot)];
    let startDate = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );
    let endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    let startTime = new Date(1970, 0, 0, start.getHours(), start.getMinutes());
    let endTime = new Date(1970, 0, 0, end.getHours(), end.getMinutes());
    if (endDate < startDate) {
      const temp = startDate;
      startDate = endDate;
      endDate = temp;
    }
    if (endTime < startTime) {
      const temp = startTime;
      startTime = endTime;
      endTime = temp;
    }

    const togglingBlocks = new Set<string>();
    for (
      let date = startDate;
      date <= endDate;
      date = new Date(date.getTime() + 24 * 60 * 60 * 1000)
    ) {
      for (
        let time = startTime;
        time <= endTime;
        time = new Date(time.getTime() + 15 * 60 * 1000)
      ) {
        togglingBlocks.add(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            time.getHours(),
            time.getMinutes(),
          ).toISOString(),
        );
      }
    }
    return togglingBlocks;
  }
}

// Initialize empty availability
export const createEmptyUserAvailability = (
  type: "specific" | "weekday" = "specific",
): UserAvailability => ({
  type,
  selections: new Set<string>(),
});

// Toggle a cell's availability (add/remove hour from Set)
export function toggleUtcSlot(
  prev: UserAvailability,
  iso: string,
): UserAvailability {
  const updated = new Set(prev.selections);
  if (updated.has(iso)) {
    updated.delete(iso);
  } else {
    updated.add(iso);
  }
  return { ...prev, selections: updated };
}

// Check if a user is available at a specific key + hour
export function isAvailable(user: UserAvailability, iso: string): boolean {
  return user.selections.has(iso);
}

export function getUtcIsoSlot(
  dateKey: string,
  hour: number,
  minute: number,
  timezone: string,
): string {
  const localDateTimeString = `${dateKey}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  const utcDate = fromZonedTime(localDateTimeString, timezone);
  return utcDate.toISOString();
}
