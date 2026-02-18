"use client";

import { useState, useEffect } from "react";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { isBefore, isAfter, isSameDay } from "date-fns";
import {
  DateRange,
  DayEventHandler,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";

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
  const [localRange, setLocalRange] = useState<DateRange | undefined>(
    selectedRange,
  );
  const [hoverDate, setHoverDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setLocalRange(selectedRange);
  }, [selectedRange]);

  // This handles the range selecting logic for the calendar. If the user clicks a day
  // and there is already a range selected, it starts a new range. Otherwise, it
  // continues the current range.
  const handleSelect = (range: DateRange | undefined, selectedDay: Date) => {
    let newRange = range;

    if (localRange?.from && localRange?.to) {
      newRange = { from: selectedDay, to: undefined };
    }

    setLocalRange(newRange);

    if (newRange?.from && newRange?.to) {
      setDateRange(newRange);
    }
  };

  const handleDayMouseEnter: DayEventHandler<React.MouseEvent> = (day) => {
    setHoverDate(day);
  };

  const handleDayMouseLeave: DayEventHandler<React.MouseEvent> = () => {
    setHoverDate(undefined);
  };

  const isSelectingEnd = localRange?.from && !localRange?.to && hoverDate;

  const previewModifier = {
    range_preview: (date: Date) => {
      if (!isSelectingEnd || !localRange?.from || !hoverDate) return false;

      // don't highlight days before the start date
      if (isBefore(hoverDate, localRange.from)) return false;

      return (
        (isAfter(date, localRange.from) || isSameDay(date, localRange.from)) &&
        (isBefore(date, hoverDate) || isSameDay(date, hoverDate))
      );
    },
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <DayPicker
        mode="range"
        numberOfMonths={numberOfMonths}
        animate
        hideNavigation={hideNavigation}
        month={month}
        onMonthChange={setMonth}
        selected={localRange}
        onSelect={handleSelect}
        disabled={{ before: startDate }}
        onDayMouseEnter={handleDayMouseEnter}
        onDayMouseLeave={handleDayMouseLeave}
        modifiers={previewModifier}
        modifiersClassNames={{
          range_preview: "rdp-range_preview",
        }}
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
