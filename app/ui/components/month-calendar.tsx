"use client";

import { useState } from "react";
import useCheckMobile from "@/app/_lib/use-check-mobile";

import { DateRange, DayPicker, getDefaultClassNames } from "react-day-picker";

type CalendarProps = {
  earliestDate?: Date;
  className?: string;
  selectedRange: DateRange;
  setDateRange: (range: DateRange | undefined) => void;
};

export function Calendar({
  earliestDate,
  className,
  selectedRange,
  setDateRange,
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  const isMobile = useCheckMobile();
  const numberOfMonths = isMobile ? 6 : 2;
  const hideNavigation = isMobile ? true : false;

  const today = new Date();

  const startDateLocal = new Date(earliestDate || today);
  const startDate = new Date(
    startDateLocal.getUTCFullYear(),
    startDateLocal.getUTCMonth(),
    startDateLocal.getUTCDate(),
  );

  const [month, setMonth] = useState(startDate);

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
        onSelect={setDateRange}
        disabled={{ before: startDate }}
        classNames={{
          root: `${defaultClassNames.root} flex justify-center items-center`,
        }}
      />
    </div>
  );
}
