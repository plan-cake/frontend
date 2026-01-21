"use client";

import { useState, useEffect } from "react";

import { days, Weekday } from "@/core/event/types";
import { cn } from "@/lib/utils/classname";

type WeekdayCalendarProps = {
  selectedDays: Weekday[];
  onChange: (map: Weekday[]) => void;
};

export default function WeekdayCalendar({
  selectedDays,
  onChange,
}: WeekdayCalendarProps) {
  const [startDay, setStartDay] = useState<Weekday | null>(null);

  useEffect(() => {
    const hasSelection = selectedDays.length > 0;
    if (hasSelection) {
      return;
    }

    const today = new Date();
    const dayOfWeek = today.getDay();
    const todayKey = days[dayOfWeek];

    const newSelection: Weekday[] = [...selectedDays];
    if (!newSelection.includes(todayKey)) {
      newSelection.push(todayKey);
    }

    onChange(newSelection);
  }, [selectedDays, onChange]);

  const handleRangeSelect = (day: Weekday) => {
    if (!startDay) {
      setStartDay(day);

      const newSelection: Weekday[] = [...selectedDays];
      days.forEach((d) => {
        const index = newSelection.indexOf(d);
        if (index !== -1) {
          newSelection.splice(index, 1);
        }
      });
      newSelection.push(day);
      onChange(newSelection);
    } else {
      // End of selection (Complete Range)
      const newSelection: Weekday[] = [...selectedDays];
      days.forEach((d) => {
        const index = newSelection.indexOf(d);
        if (index !== -1) {
          newSelection.splice(index, 1);
        }
      });

      const startIndex = days.indexOf(startDay);
      const endIndex = days.indexOf(day);

      const [min, max] = [
        Math.min(startIndex, endIndex),
        Math.max(startIndex, endIndex),
      ];

      for (let i = min; i <= max; i++) {
        newSelection.push(days[i]);
      }

      setStartDay(null);
      onChange(newSelection);
    }
  };

  const activeIndices = days
    .map((day, i) => (selectedDays.includes(day) ? i : -1))
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
              "flex h-8 w-10 items-center justify-center px-6",
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
