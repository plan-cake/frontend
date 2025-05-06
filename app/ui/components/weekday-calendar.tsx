"use client";

import { useState } from "react";
import Checkbox from "./checkbox";

type WeekdayCalendarProps = {
  selectedDays: string[];
  days: string[];
  onChange: (days: string[]) => void;
};

export default function WeekdayCalendar({
  selectedDays,
  days,
  onChange,
}: WeekdayCalendarProps) {
  const [startMonday, setStartMonday] = useState(false);
  days = startMonday ? [...days.slice(1), days[0]] : days;

  const handleRangeSelect = (day: string) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid w-fit grid-cols-7 divide-x-1 divide-solid divide-gray-300 border border-gray-300 md:w-full">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => handleRangeSelect(day)}
            className={`p-2 ${
              selectedDays.includes(day)
                ? "bg-red-400 text-red dark:bg-red dark:text-white"
                : ""
            } `}
          >
            {day}
          </button>
        ))}
      </div>

      <Checkbox
        label="Start on Monday"
        checked={startMonday}
        onChange={setStartMonday}
      />
    </div>
  );
}
