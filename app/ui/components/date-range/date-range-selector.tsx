"use client";

import { useCallback } from "react";
import { DateRangeProps } from "@/app/_lib/types/date-range-props";
import { WeekdayMap } from "@/app/_lib/schedule/types";

// Import child components
import useCheckMobile from "@/app/_lib/use-check-mobile";
import WeekdayCalendar from "@/app/ui/components/weekday-calendar";
import DateRangeDrawer from "@/app/ui/components/date-range/date-range-drawer";
import DateRangePopover from "@/app/ui/components/date-range/date-range-popover";
import EventTypeSelect from "@/app/ui/components/selectors/event-type-select";

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
      <div className="mb-4 flex w-full flex-row gap-8">
        <div className="flex flex-col">
          <label htmlFor="date-range-type">Type</label>
          <EventTypeSelect
            eventType={rangeType}
            onEventTypeChange={handleRangeTypeChange}
          />
        </div>
        <div className="flex w-full flex-col justify-center gap-2">
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
