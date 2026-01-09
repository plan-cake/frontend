"use client";

import { useState } from "react";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { DateRange, DayPicker, getDefaultClassNames } from "react-day-picker";

import useCheckMobile from "@/lib/hooks/use-check-mobile";
import { cn } from "@/lib/utils/classname";

type CalendarProps = {
  earliestDate?: Date;
  className?: string;
  selectedRange: DateRange;
  setDateRange: (range: DateRange | undefined) => void;
  dateRangeError?: string;
};

export function Calendar({
  earliestDate,
  className,
  selectedRange,
  setDateRange,
  dateRangeError,
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  const isMobile = useCheckMobile();
  const numberOfMonths = isMobile ? 6 : 2;
  const hideNavigation = isMobile ? true : false;

  const today = new Date();

  const startDate =
    earliestDate && earliestDate < today
      ? new Date(
          earliestDate.getUTCFullYear(),
          earliestDate.getUTCMonth(),
          earliestDate.getUTCDate(),
        )
      : today;

  const [month, setMonth] = useState(startDate);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* <button
        onClick={() => setMonth(today)}
        className="border-1 border-red rounded-full px-6 py-1 hover:bg-red-300 dark:hover:bg-red-900"
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
      {!isMobile && dateRangeError && (
        <div className="text-error flex items-center justify-center gap-1 font-bold">
          <ExclamationTriangleIcon />
          {dateRangeError}
        </div>
      )}
    </div>
  );
}
