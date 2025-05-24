import CustomSelect from "../custom-select";
import DateRangeDrawer from "./date-range-drawer";
import DateRangePopover from "./date-range-popover";
import WeekdayCalendar from "../weekday-calendar";
import { DateRangeProps } from "@/app/_types/date-range-types";
import { WeekdayMap } from "@/app/_types/schedule-types";

import useCheckMobile from "@/app/_utils/use-check-mobile";

export default function DateRangeSelector({
  eventRange,
  onChangeEventRange,
}: DateRangeProps) {
  const isMobile = useCheckMobile();

  const rangeType = eventRange?.type ?? "specific";

  const handleRangeTypeChange = (value: string | number) => {
    console.log("handleRangeTypeChange", value);
    const newType = value === "specific" ? "specific" : "weekday";
    if (newType !== eventRange?.type) {
      onChangeEventRange?.(
        newType === "specific"
          ? {
              type: "specific",
              duration: 60,
              dateRange: { from: new Date(), to: new Date() },
              timeRange: eventRange?.timeRange ?? { from: null, to: null },
            }
          : {
              type: "weekday",
              duration: 60,
              weekdays: {
                Sun: 0,
                Mon: 0,
                Tue: 0,
                Wed: 0,
                Thu: 0,
                Fri: 0,
                Sat: 0,
              },
              timeRange: eventRange?.timeRange ?? { from: null, to: null },
            },
      );
    }

    console.log("handleRangeTypeChange", newType);
    console.log("eventRange", eventRange);
  };

  const updateSpecificRange = (key: "from" | "to", value: Date) => {
    if (eventRange?.type === "specific") {
      onChangeEventRange?.({
        ...eventRange,
        dateRange: {
          ...eventRange.dateRange,
          [key]: value,
        },
      });
    }
  };

  const updateWeekdayRange = (map: WeekdayMap) => {
    if (eventRange?.type === "weekday") {
      onChangeEventRange?.({ ...eventRange, weekdays: map });
    }
  };

  const select = (
    <CustomSelect
      options={[
        { label: "Specific Dates", value: "specific" },
        { label: "Days of the Week", value: "weekday" },
      ]}
      value={rangeType === "specific" ? "specific" : "weekday"}
      onValueChange={handleRangeTypeChange}
      className="hidden min-h-9 min-w-[180px] md:flex"
    />
  );

  if (isMobile) {
    return (
      <DateRangeDrawer
        eventRange={eventRange}
        onChangeRangeType={handleRangeTypeChange}
        onChangeSpecific={updateSpecificRange}
        onChangeWeekday={updateWeekdayRange}
      />
    );
  }

  return (
    <div className="flex gap-4 bg-amber-50 md:flex-row">
      {select}
      {eventRange?.type === "specific" ? (
        <DateRangePopover
          specificRange={eventRange.dateRange}
          onChangeSpecific={updateSpecificRange}
        />
      ) : (
        <WeekdayCalendar
          selectedDays={
            eventRange?.weekdays ?? {
              Sun: 0,
              Mon: 0,
              Tue: 0,
              Wed: 0,
              Thu: 0,
              Fri: 0,
              Sat: 0,
            }
          }
          onChange={updateWeekdayRange}
        />
      )}
    </div>
  );
}
