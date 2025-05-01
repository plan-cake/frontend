"use client";

import { useState } from "react";

interface ScheduleGridProps {
  isGenericWeek: boolean;
  disableSelect?: boolean;
  weekdays?: string[];
  dateRange?: { from: Date; to: Date };
  timeRange: { from: Date; to: Date };
}

export default function ScheduleGrid(props: ScheduleGridProps) {
  const {
    isGenericWeek,
    disableSelect = false,
    weekdays,
    dateRange = { from: new Date(), to: new Date() },
    timeRange = { from: new Date(), to: new Date() },
  } = props;

  const numHours = timeRange.to.getHours() - timeRange.from.getHours() + 1;
  const numDays = isGenericWeek
    ? (weekdays?.length ?? 0)
    : dateRange.to.getDate() - dateRange.from.getDate() + 1;

  return (
    <div className="relative h-[60vh] w-full md:w-1/2">
      <div
        className="grid h-full w-full divide-x-1 divide-y-1 divide-solid divide-gray-300"
        style={{
          gridTemplateColumns: `60px repeat(${numDays}, 1fr)`,
          gridTemplateRows: `30px repeat(${numHours}, 1fr)`,
        }}
      >
        {/* Grid cells */}
        {Array.from({ length: (numHours + 1) * (numDays + 1) + 1 }).map(
          (_, i) => (
            <div
              key={i}
              className={`${disableSelect ? "cursor-not-allowed" : ""}`}
            />
          ),
        )}
      </div>

      {/* Time labels positioned between lines */}
      <div
        className="pointer-events-none absolute top-0 left-0 grid h-full w-[60px] bg-white"
        style={{
          gridTemplateRows: `30px repeat(${numHours}, 1fr)`,
        }}
      >
        <div /> {/* Empty header corner */}
        {Array.from({ length: numHours }).map((_, i) => {
          const hour = new Date(timeRange.from.getTime() + i * 3600000);
          return (
            <div
              key={i}
              className="relative flex items-start justify-end pr-2 text-right text-xs"
            >
              <span className="absolute -top-2">
                {hour.toLocaleTimeString([], { hour: "numeric", hour12: true })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Column headers */}
      <div
        className="absolute top-0 right-0 left-[60px] grid h-[30px]"
        style={{
          gridTemplateColumns: `repeat(${numDays}, 1fr)`,
        }}
      >
        {Array.from({ length: numDays }).map((_, dayIndex) => (
          <div
            key={`day-${dayIndex}`}
            className="flex items-center justify-center text-sm font-medium"
          >
            {isGenericWeek
              ? weekdays?.[dayIndex]
              : new Date(
                  dateRange.from.getTime() + dayIndex * 86400000,
                ).toLocaleDateString()}
          </div>
        ))}
      </div>
    </div>
  );
}
