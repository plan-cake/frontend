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
    <div className="flex space-y-2">
      <div className="grid flex-1 grid-cols-7 gap-x-2">
        {days.map((day) => {
          const isSelected = selectedDays[day] === 1;
          return (
            <button
              key={day}
              onClick={() => handleRangeSelect(day)}
              className={`flex aspect-square w-full items-center justify-center rounded-full p-1 text-center transition-all duration-200 ${isSelected ? "bg-blue-200 dark:bg-red" : "hover:bg-gray-200 dark:hover:bg-gray-800"} `}
            >
              {day}
            </button>
          );
        })}
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
