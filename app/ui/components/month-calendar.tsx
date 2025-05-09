"use client";

import { useState } from "react";
import useCheckMobile from "@/app/_utils/useCheckMobile";

import {
  DateRange,
  DayPicker,
  SelectRangeEventHandler,
  getDefaultClassNames,
} from "react-day-picker";
import "react-day-picker/dist/style.css";

type CalendarProps = {
  className?: string;
  selectedRange?: DateRange;
  onRangeSelect?: (from: Date | null, to: Date | null) => void;
};

export function Calendar({
  className,
  selectedRange,
  onRangeSelect,
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  const isMobile = useCheckMobile();
  const numberOfMonths = isMobile ? 12 : 2;
  const hideNavigation = isMobile ? true : false;

  const today = new Date();

  const [month, setMonth] = useState(today);

  const handleRangeSelect: SelectRangeEventHandler = (
    range: DateRange | undefined,
  ) => {
    const from = range?.from || null;
    const to = range?.to || null;
    onRangeSelect?.(from, to);
  };

  return (
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
  );
}
