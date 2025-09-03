import useCheckMobile from "@/app/_lib/use-check-mobile";
import { DateRangeProps } from "@/app/_lib/types/date-range-props";
import { WeekdayMap } from "@/app/_lib/schedule/types";

import CustomSelect from "@/app/ui/components/custom-select";
import WeekdayCalendar from "@/app/ui/components/weekday-calendar";
import DateRangeDrawer from "@/app/ui/components/date-range/date-range-drawer";
import DateRangePopover from "@/app/ui/components/date-range/date-range-popover";

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
              timezone:
                eventRange?.timezone ??
                Intl.DateTimeFormat().resolvedOptions().timeZone,
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
              timezone:
                eventRange?.timezone ??
                Intl.DateTimeFormat().resolvedOptions().timeZone,
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
    <div className="flex flex-col gap-1">
      <label htmlFor="date-range-type">Type</label>
      <CustomSelect
        options={[
          { label: "Specific Dates", value: "specific" },
          { label: "Days of the Week", value: "weekday" },
        ]}
        value={rangeType === "specific" ? "specific" : "weekday"}
        onValueChange={handleRangeTypeChange}
        className="hidden min-h-9 min-w-[180px] md:flex"
      />
    </div>
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
    <div className="mb-4 flex flex-row gap-8">
      {select}
      <div className="flex flex-col justify-center gap-2">
        {eventRange?.type === "specific" ? (
          <>
            <label htmlFor="date-range">Possible Dates</label>
            <DateRangePopover
              specificRange={eventRange.dateRange}
              onChangeSpecific={updateSpecificRange}
            />
          </>
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
    </div>
  );
}
