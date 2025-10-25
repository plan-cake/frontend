"use client";

import { useState } from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { DateRange, DayPicker, getDefaultClassNames } from "react-day-picker";

import useCheckMobile from "@/src/lib/hooks/use-check-mobile";
import { checkInvalidDateRangeLength } from "@/src/features/event/editor/validate-data";

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

  const startDate =
    earliestDate && earliestDate < today
      ? new Date(
          earliestDate.getUTCFullYear(),
          earliestDate.getUTCMonth(),
          earliestDate.getUTCDate(),
        )
      : today;

  const [month, setMonth] = useState(startDate);
  const [tooManyDays, setTooManyDays] = useState(() => {
    return checkInvalidDateRangeLength(selectedRange);
  });

  const checkDateRange = (range: DateRange | undefined) => {
    setTooManyDays(checkInvalidDateRangeLength(range));
    setDateRange(range);
  };

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
        onSelect={checkDateRange}
        disabled={{ before: startDate }}
        classNames={{
          root: `${defaultClassNames.root} flex justify-center items-center`,
        }}
      />
      {!isMobile && tooManyDays && (
        <div className="flex items-center justify-center gap-1 font-bold text-[#ED7183]">
          <ExclamationTriangleIcon />
          Too many days selected. Max is 30 days.
        </div>
      )}
    </div>
  );
}
