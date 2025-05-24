// _types/date-range-types.ts

import { EventRange, WeekdayMap } from "@/app/_types/schedule-types";

export type DateRangeProps = {
  eventRange?: EventRange;
  onChangeEventRange?: (range: EventRange) => void;
  displayCalendar?: boolean;

  // optional legacy support props
  rangeType?: "specific" | "weekday";
  onChangeRangeType?: (type: "specific" | "weekday") => void;
  specificRange?: { from: Date | null; to: Date | null };
  onChangeSpecific?: (key: "from" | "to", value: Date) => void;
  weekdayRange?: WeekdayMap;
  onChangeWeekday?: (map: WeekdayMap) => void;
};
