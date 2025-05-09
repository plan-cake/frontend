"use client";

import { useState } from "react";
import Checkbox from "./checkbox";

import { WeekdayMap } from "@/app/_types/schedule-types";

type WeekdayCalendarProps = {
  selectedDays: WeekdayMap;
  onChange: (map: WeekdayMap) => void;
};

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeekdayCalendar({
  selectedDays,
  onChange,
}: WeekdayCalendarProps) {
  const [startMonday, setStartMonday] = useState(false);
  days = startMonday ? [...days.slice(1), days[0]] : days;

  const handleRangeSelect = (day: string) => {
    onChange({
      ...selectedDays,
      [day]: selectedDays[day] === 1 ? 0 : 1,
    });
  };

  return (
    <div className="space-y-2">
      <div className="grid w-fit grid-cols-7 divide-x-1 divide-solid divide-gray-300 rounded-lg border border-gray-300 text-sm md:w-full dark:divide-gray-400 dark:border-gray-400">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => handleRangeSelect(day)}
            className={`min-h-9 px-2 py-1 ${
              selectedDays[day] === 1
                ? "bg-red-300 text-red dark:bg-red dark:text-white"
                : ""
            } `}
          >
            {day}
          </button>
        ))}
      </div>
      {/* 
      <Checkbox
        label="Start on Monday"
        checked={startMonday}
        onChange={setStartMonday}
      /> */}
    </div>
  );
}
