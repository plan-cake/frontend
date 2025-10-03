"use client";

import { useCallback } from "react";
import { DateRangeProps } from "@/app/_lib/types/date-range-props";
import { WeekdayMap } from "@/app/_lib/schedule/types";

// Import child components
import useCheckMobile from "@/app/_lib/use-check-mobile";
import CustomSelect from "@/app/ui/components/custom-select";
import WeekdayCalendar from "@/app/ui/components/weekday-calendar";
import DateRangeDrawer from "@/app/ui/components/date-range/date-range-drawer";
import DateRangePopover from "@/app/ui/components/date-range/date-range-popover";

export default function DateRangeSelector({
  eventRange,
  dispatch,
}: DateRangeProps) {
  const isMobile = useCheckMobile();

  const handleRangeTypeChange = useCallback((value: string) => {
    dispatch({
      type: "SET_RANGE_TYPE",
      payload: value as "specific" | "weekday",
    });
  }, []);

  const updateWeekdayRange = useCallback((map: WeekdayMap) => {
    dispatch({ type: "SET_WEEKDAYS", payload: { weekdays: map } });
  }, []);

  const rangeType = eventRange?.type ?? "specific";

  if (isMobile) {
    return <DateRangeDrawer eventRange={eventRange} dispatch={dispatch} />;
  } else {
    return (
      <div className="mb-4 flex flex-row gap-8">
        <div className="flex flex-col gap-1">
          <label htmlFor="date-range-type">Type</label>
          <CustomSelect
            options={[
              { label: "Specific Dates", value: "specific" },
              { label: "Days of the Week", value: "weekday" },
            ]}
            value={rangeType === "specific" ? "specific" : "weekday"}
            onValueChange={(value) =>
              handleRangeTypeChange?.(
                value === "Specific Dates" ? "specific" : "weekday",
              )
            }
            className="hidden min-h-9 min-w-[180px] md:flex"
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          {eventRange?.type === "specific" ? (
            <>
              <label htmlFor="date-range">Possible Dates</label>
              <DateRangePopover eventRange={eventRange} dispatch={dispatch} />
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
}
