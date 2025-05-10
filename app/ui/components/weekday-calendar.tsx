"use client";

import { useState, useEffect } from "react";
import Checkbox from "./checkbox";

import { WeekdayMap } from "@/app/_types/schedule-types";

type WeekdayCalendarProps = {
  selectedDays: WeekdayMap;
  onChange: (map: WeekdayMap) => void;
};

let days: Array<keyof WeekdayMap> = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export default function WeekdayCalendar({
  selectedDays,
  onChange,
}: WeekdayCalendarProps) {
  const [startMonday, setStartMonday] = useState(false);
  days = startMonday ? [...days.slice(1), days[0]] : days;

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    selectedDays[days[dayOfWeek]] = 1;
    onChange(selectedDays);
  }, []);

  const handleRangeSelect = (day: keyof WeekdayMap) => {
    const newSelectedDays = { ...selectedDays };
    newSelectedDays[day] = newSelectedDays[day] === 1 ? 0 : 1;
    onChange(newSelectedDays);
  };

  return (
    <div className="space-y-2">
      <div className="grid w-fit grid-cols-7 divide-x-1 divide-solid divide-gray-300 rounded-lg border border-gray-300 text-sm md:w-full dark:divide-gray-400 dark:border-gray-400">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => handleRangeSelect(day as keyof WeekdayMap)}
            className={`min-h-9 px-2 py-1 ${
              selectedDays[day as keyof WeekdayMap] === 1
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
