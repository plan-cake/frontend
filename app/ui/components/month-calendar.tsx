"use client";

import { useState, useCallback } from "react";
import useCheckMobile from "@/app/_lib/use-check-mobile";
import { Dispatch } from "react";
import { EventRangeAction } from "@/app/_lib/schedule/event-range-reducer";

import { DateRange, DayPicker, getDefaultClassNames } from "react-day-picker";

type CalendarProps = {
  className?: string;
  selectedRange: DateRange;
  dispatch: Dispatch<EventRangeAction>;
};

export function Calendar({
  className,
  selectedRange,
  dispatch,
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  const isMobile = useCheckMobile();
  const numberOfMonths = isMobile ? 6 : 2;
  const hideNavigation = isMobile ? true : false;

  const today = new Date();

  const [month, setMonth] = useState(today);

  const handleRangeSelect = useCallback((range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const from = range.from.toISOString();
      const to = range.to.toISOString();
      dispatch({
        type: "SET_DATE_RANGE",
        payload: { from, to },
      });
    }
  }, []);

  return (
    <div className={className}>
      {/* <button
        onClick={() => setMonth(today)}
        className="rounded-full border-1 border-red px-6 py-1 hover:bg-red-300 dark:hover:bg-red-900"
      >
        Today
      </button> */}
      <DayPicker
        mode="range"
        numberOfMonths={numberOfMonths}
        animate
        hideNavigation={hideNavigation}
        month={month}
        onMonthChange={setMonth}
        selected={selectedRange}
        onSelect={handleRangeSelect}
        disabled={{ before: new Date() }}
        classNames={{
          root: `${defaultClassNames.root} flex justify-center items-center`,
        }}
      />
    </div>
  );
}
