import { DateRange } from "react-day-picker";
import { EventRange, WeekdayMap } from "@/src/core/event/types";

export type DateRangeProps = {
  earliestDate?: Date;
  eventRange: EventRange;
  tooManyDays?: boolean;
  editing?: boolean;

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
