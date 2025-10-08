"use client";

import { ChangeEventHandler, useEffect, useState } from "react";
import useCheckMobile from "@/app/_lib/use-check-mobile";

import { format, isAfter, isBefore, isValid, parse } from "date-fns";
import {
  DateRange,
  DayPicker,
  SelectRangeEventHandler,
  getDefaultClassNames,
} from "react-day-picker";
import "react-day-picker/dist/style.css";

type CalendarProps = {
  className?: string;
  onRangeSelect?: (from: string | null, to: string | null) => void;
};

export function Calendar({ className, onRangeSelect }: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  const isMobile = useCheckMobile();
  const numberOfMonths = isMobile ? 12 : 2;
  const hideNavigation = isMobile ? true : false;

  const today = new Date();

  const [month, setMonth] = useState(today);
  const [selectedRange, setSelectedRange] = useState<DateRange>();

  // const [fromValue, setFromValue] = useState<string>("");
  // const [toValue, setToValue] = useState<string>("");

  // const handleFromChange: ChangeEventHandler<HTMLInputElement> = (e) => {
  //   setFromValue(e.target.value);
  //   const date = parse(e.target.value, "EEE, MMM d", new Date());
  //   if (!isValid(date)) {
  //     return setSelectedRange({ from: undefined, to: undefined });
  //   }
  //   if (selectedRange?.to && isAfter(date, selectedRange.to)) {
  //     setSelectedRange({ from: selectedRange.to, to: date });
  //   } else {
  //     setSelectedRange({ from: date, to: selectedRange?.to });
  //   }
  // };

  // const handleToChange: ChangeEventHandler<HTMLInputElement> = (e) => {
  //   setToValue(e.target.value);
  //   const date = parse(e.target.value, "EEE, MMM d", new Date());

  //   if (!isValid(date)) {
  //     return setSelectedRange({ from: selectedRange?.from, to: undefined });
  //   }
  //   if (selectedRange?.from && isBefore(date, selectedRange.from)) {
  //     setSelectedRange({ from: date, to: selectedRange.from });
  //   } else {
  //     setSelectedRange({ from: selectedRange?.from, to: date });
  //   }
  // };

  const handleRangeSelect: SelectRangeEventHandler = (
    range: DateRange | undefined,
  ) => {
    setSelectedRange(range);
    const from = range?.from ? format(range.from, "EEE, MMM d") : "";
    const to = range?.to ? format(range.to, "EEE, MMM d") : "";
    // setFromValue(from);
    // setToValue(to);
    onRangeSelect?.(from, to);
  };

  return (
    <div className={className}>
      {/* <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setMonth(today)}
          className="rounded-full border-1 border-red px-6 py-1 hover:bg-red-300 dark:hover:bg-red-900"
        >
          Today
        </button>
        <form className="ma2 rounded-full">
          <input
            size={10}
            placeholder="Start Day"
            value={fromValue}
            onChange={handleFromChange}
            className="rounded-l-full border-1 border-violet-500 px-4 py-1 text-center hover:border-red focus:outline-none"
          />
          <input
            size={10}
            placeholder="End Day"
            value={toValue}
            onChange={handleToChange}
            className="rounded-r-full border-1 border-violet-500 px-4 py-1 text-center hover:border-red focus:outline-none"
          />
        </form>
      </div> */}

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
