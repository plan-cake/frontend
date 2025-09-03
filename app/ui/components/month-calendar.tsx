"use client";

import { useState } from "react";
import useCheckMobile from "@/app/_lib/use-check-mobile";

import {
  DateRange,
  DayPicker,
  SelectRangeEventHandler,
  getDefaultClassNames,
} from "react-day-picker";

type CalendarProps = {
  className?: string;
  selectedRange: DateRange;
  onRangeSelect: (range: { from: Date | null; to: Date | null }) => void;
};

export function Calendar({
  className,
  selectedRange,
  onRangeSelect,
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  const isMobile = useCheckMobile();
  const numberOfMonths = isMobile ? 6 : 2;
  const hideNavigation = isMobile ? true : false;

  const today = new Date();

  const [month, setMonth] = useState(today);

  const handleRangeSelect: SelectRangeEventHandler = (
    range: DateRange | undefined,
  ) => {
    const from = range?.from || null;
    const to = range?.to || null;
    onRangeSelect({ from, to });
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
        onSelect={handleRangeSelect}
        disabled={{ before: new Date() }}
        classNames={{
          root: `${defaultClassNames.root} flex justify-center items-center`,
        }}
      />
    </div>
  );
}
