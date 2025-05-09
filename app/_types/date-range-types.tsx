import { WeekdayMap } from "@/app/_types/schedule-types";

export type DateRangeProps = {
  rangeType?: "specific" | "weekday";
  onChangeRangeType?: (type: "specific" | "weekday") => void;
  specificRange: { from: Date | null; to: Date | null };
  onChangeSpecific: (range: { from: Date | null; to: Date | null }) => void;
  weekdayRange?: WeekdayMap;
  onChangeWeekday?: (map: WeekdayMap) => void;
  displayCalendar?: boolean;
};
