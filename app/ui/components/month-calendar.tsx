"use client";

import { useState } from "react";
import useCheckMobile from "@/app/utils/useCheckMobile";

import { format } from "date-fns";
import {
  DateRange,
  DayPicker,
  SelectRangeEventHandler,
  getDefaultClassNames,
} from "react-day-picker";
import "react-day-picker/dist/style.css";

type CalendarProps = {
  className?: string;
  onRangeSelect?: (from: Date | null, to: Date | null) => void;
};

export function Calendar({ className, onRangeSelect }: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  const isMobile = useCheckMobile();
  const numberOfMonths = isMobile ? 12 : 2;
  const hideNavigation = isMobile ? true : false;

  const today = new Date();

  const [month, setMonth] = useState(today);
  const [selectedRange, setSelectedRange] = useState<DateRange>();

  const handleRangeSelect: SelectRangeEventHandler = (
    range: DateRange | undefined,
  ) => {
    setSelectedRange(range);
    const from = range?.from || null;
    const to = range?.to || null;
    onRangeSelect?.(from, to);
  };

  return (
    <div className={className}>
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
          root: `${defaultClassNames.root}`,
        }}
      />
    </div>
  );
}
