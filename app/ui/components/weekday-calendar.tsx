"use client";

import { useState, useEffect } from "react";
import { cn } from "@/app/_lib/classname";

import { days, WeekdayMap, Weekday } from "@/app/_lib/schedule/types";

type WeekdayCalendarProps = {
  selectedDays: WeekdayMap;
  onChange: (map: WeekdayMap) => void;
};

export default function WeekdayCalendar({
  selectedDays,
  onChange,
}: WeekdayCalendarProps) {
  const [startMonday, setStartMonday] = useState(false);
  const reorderedDays = startMonday ? [...days.slice(1), days[0]] : days;

  // for toggling ranges of days
  const [startDay, setStartDay] = useState<Weekday | null>(null);

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    selectedDays[days[dayOfWeek]] = 1;
    onChange(selectedDays);
  }, []);

  // for toggling only one day at a time
  // currently not in use
  const handleDayClick = (day: Weekday) => {
    const newSelectedDays = { ...selectedDays };
    newSelectedDays[day] = newSelectedDays[day] === 1 ? 0 : 1;
    onChange(newSelectedDays);
  };

  const handleRangeSelect = (day: Weekday) => {
    if (!startDay) {
      // set it as the start of the range
      setStartDay(day);

      // clear previous selections and select this day
      const newSelection: WeekdayMap = { ...selectedDays };
      days.forEach((d) => (newSelection[d] = 0));
      newSelection[day] = 1;
      onChange(newSelection);
    } else {
      // complete range
      const newSelection: WeekdayMap = { ...selectedDays };
      days.forEach((d) => (newSelection[d] = 0));

      const startIndex = days.indexOf(startDay);
      const endIndex = days.indexOf(day);

      // determine the range boundaries
      const [min, max] = [
        Math.min(startIndex, endIndex),
        Math.max(startIndex, endIndex),
      ];

      for (let i = min; i <= max; i++) {
        newSelection[days[i]] = 1;
      }

      setStartDay(null);
      onChange(newSelection);
    }
  };

  return (
    <div className="flex space-y-2">
      <div className="grid grid-cols-7 gap-x-2">
        {days.map((day) => {
          const isSelected = selectedDays[day] === 1;
          return (
            <button
              key={day}
              onClick={() => handleRangeSelect(day)}
              className={cn(
                "aspect-square w-10 items-center justify-center rounded-full text-center",
                "transition-all duration-200",
                isSelected
                  ? "bg-blue-400 text-white dark:bg-red"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* <Checkbox
        label="Start on Monday"
        checked={startMonday}
        onChange={setStartMonday}
      /> */}
    </div>
  );
}
