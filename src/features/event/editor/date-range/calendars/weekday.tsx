"use client";

import { useState, useEffect } from "react";

import { days, WeekdayMap, Weekday } from "@/core/event/types";
import { cn } from "@/lib/utils/classname";

type WeekdayCalendarProps = {
  selectedDays: WeekdayMap;
  onChange: (map: WeekdayMap) => void;
};

export default function WeekdayCalendar({
  selectedDays,
  onChange,
}: WeekdayCalendarProps) {
  const [startDay, setStartDay] = useState<Weekday | null>(null);

  useEffect(() => {
    const hasSelection = Object.values(selectedDays).some((val) => val === 1);
    if (hasSelection) {
      return;
    }

    const today = new Date();
    const dayOfWeek = today.getDay();
    const todayKey = days[dayOfWeek];

    const newSelection: WeekdayMap = { ...selectedDays };
    newSelection[todayKey] = 1;

    onChange(newSelection);
  }, [selectedDays, onChange]);

  const handleRangeSelect = (day: Weekday) => {
    if (!startDay) {
      setStartDay(day);

      const newSelection: WeekdayMap = { ...selectedDays };
      days.forEach((d) => (newSelection[d] = 0));
      newSelection[day] = 1;
      onChange(newSelection);
    } else {
      // End of selection (Complete Range)
      const newSelection: WeekdayMap = { ...selectedDays };
      days.forEach((d) => (newSelection[d] = 0));

      const startIndex = days.indexOf(startDay);
      const endIndex = days.indexOf(day);

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

  const activeIndices = days
    .map((day, i) => (selectedDays[day] === 1 ? i : -1))
    .filter((i) => i !== -1);

  const rangeStart = activeIndices.length ? Math.min(...activeIndices) : -1;
  const rangeEnd = activeIndices.length ? Math.max(...activeIndices) : -1;

  return (
    <div className="flex w-full select-none flex-row flex-wrap">
      {days.map((day, index) => {
        const isActive = index >= rangeStart && index <= rangeEnd;
        const isStart = index === rangeStart;
        const isEnd = index === rangeEnd;

        return (
          <button
            key={day}
            onClick={() => handleRangeSelect(day)}
            className={cn(
              "flex h-10 w-10 items-center justify-center px-6",
              "hover:bg-accent/25 active:bg-accent/40",
              !isActive && "rounded-full",
              isActive && "bg-accent/15 text-accent",
              isStart && "rounded-l-full",
              isEnd && "rounded-r-full",
            )}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}
