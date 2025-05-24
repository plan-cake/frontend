// components/interactive-schedule-grid.tsx

"use client";

import { useCallback, useState, useRef } from "react";
import ScheduleGrid from "./schedule-grid";
import {
  UserAvailability,
  toggleAvailability,
  isAvailable,
  addAvailability,
  removeAvailability,
} from "@/app/_types/user-availability";
import { EventRange } from "@/app/_types/schedule-types";

interface InteractiveScheduleGridProps {
  eventRange: EventRange;
  timezone: string;
  userAvailability: UserAvailability;
  setUserAvailability: (ua: UserAvailability) => void;
}

export default function InteractiveScheduleGrid({
  eventRange,
  timezone,
  userAvailability,
  setUserAvailability,
}: InteractiveScheduleGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragMode = useRef<"add" | "remove">("add");

  const getDayKeys = (): string[] => {
    if (eventRange.type === "specific") {
      const { dateRange } = eventRange;
      const days: string[] = [];
      if (dateRange?.from && dateRange?.to) {
        const current = new Date(dateRange.from);
        while (current <= dateRange.to) {
          days.push(current.toISOString().split("T")[0]);
          current.setDate(current.getDate() + 1);
        }
      }
      return days;
    } else {
      return Object.entries(eventRange.weekdays)
        .filter(([, enabled]) => enabled === 1)
        .map(([day]) => day);
    }
  };

  const hours = (): number[] => {
    const from = eventRange.timeRange.from;
    const to = eventRange.timeRange.to;
    if (!from || !to) return [];
    const fromHour = from.getHours();
    const toHour = to.getHours();
    return Array.from(
      { length: toHour - fromHour + 1 },
      (_, i) => fromHour + i,
    );
  };

  const dayKeys = getDayKeys();
  const hourList = hours();

  const handleStart = (day: string, hour: number) => {
    const selected = isAvailable(userAvailability, day, hour);
    dragMode.current = selected ? "remove" : "add";
    setIsDragging(true);
    updateSelection(day, hour);
  };

  const handleEnter = (day: string, hour: number) => {
    if (isDragging) updateSelection(day, hour);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const updateSelection = (day: string, hour: number) => {
    const updated =
      dragMode.current === "add"
        ? addAvailability(userAvailability, day, hour)
        : removeAvailability(userAvailability, day, hour);
    setUserAvailability(updated);
  };

  return (
    <div
      className="h-full"
      onMouseLeave={handleEnd}
      onMouseUp={handleEnd}
      onTouchEnd={handleEnd}
    >
      <ScheduleGrid
        eventRange={eventRange}
        timezone={timezone}
        disableSelect={false}
      />

      <div
        className="pointer-events-none absolute inset-0 z-10 grid"
        style={{
          gridTemplateColumns: `50px repeat(${dayKeys.length}, 1fr) 20px`,
          gridTemplateRows: `50px repeat(${hourList.length}, 1fr)`,
        }}
      >
        {hourList.map((hour) =>
          dayKeys.map((day) => {
            const selected = isAvailable(userAvailability, day, hour);
            return (
              <div
                key={`${day}-${hour}`}
                className={`pointer-events-auto border border-transparent ${selected ? "bg-blue-400/40" : "hover:bg-blue-200/30"}`}
                onMouseDown={() => handleStart(day, hour)}
                onMouseEnter={() => handleEnter(day, hour)}
                onTouchStart={() => handleStart(day, hour)}
                onTouchMove={(e) => {
                  const target = document.elementFromPoint(
                    e.touches[0].clientX,
                    e.touches[0].clientY,
                  );
                  const dataset = target?.getAttribute("data-key-hour");
                  if (dataset) {
                    const [d, h] = dataset.split(":");
                    handleEnter(d, parseInt(h));
                  }
                }}
                data-key-hour={`${day}:${hour}`}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
