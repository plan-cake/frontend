import { EventRange, WeekdayMap } from "@/app/_lib/schedule/types";
import { DateRange } from "react-day-picker";

export type DateRangeProps = {
  earliestDate?: Date;
  eventRange: EventRange;
  tooManyDays?: boolean;
  disabled?: boolean;

  // update functions
  setTitle?: (title: string) => void;
  setCustomCode?: (code: string) => void;
  setEventType?: (type: "specific" | "weekday") => void;
  setTimezone?: (tz: string) => void;
  setDuration?: (duration: number) => void;
  setTimeRange?: (timeRange: { from: number; to: number }) => void;
  setDateRange?: (dateRange: DateRange | undefined) => void;
  setWeekdayRange?: (weekdays: WeekdayMap) => void;

  displayCalendar?: boolean;
};
