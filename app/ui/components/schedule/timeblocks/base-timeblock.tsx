"use client";

import { useMemo } from "react";

interface TimeBlockProps {
  timeColWidth: number;
  numQuarterHours: number;
  startHour: number;
  visibleDaysCount: number;
  children: React.ReactNode;
}

export default function BaseTimeBlock({
  timeColWidth,
  numQuarterHours,
  startHour,
  visibleDaysCount,
  children,
}: TimeBlockProps) {
  // generate hour labels for the time column
  const hoursLabel = useMemo(() => {
    return Array.from({ length: numQuarterHours }, (_, i) => {
      const hour24 = startHour + Math.floor(i / 4);
      const hour12 = hour24 % 12 || 12;
      const period = hour24 < 12 ? "AM" : "PM";
      return `${hour12} ${period}`;
    });
  }, [startHour, numQuarterHours]);

  return (
    <div className="flex grow flex-row">
      {/* time labels */}
      <div
        className="pointer-events-none"
        style={{
          width: `${timeColWidth}px`,
          display: "grid",
          gridTemplateRows: `repeat(${numQuarterHours}, minmax(20px, 1fr))`,
        }}
      >
        {Array.from({ length: numQuarterHours }).map((_, i) =>
          i % 4 === 0 ? (
            <div
              key={`label-${i}`}
              className="relative flex items-start justify-end pr-2 text-right text-xs"
            >
              <span className="absolute -top-2">{hoursLabel[i]}</span>
            </div>
          ) : (
            <div key={`empty-${i}`} />
          ),
        )}
      </div>

      <div
        className="grid w-full gap-x-[1px] border border-gray-400 bg-gray-400"
        style={{
          gridTemplateColumns: `repeat(${visibleDaysCount}, 1fr)`,
          gridTemplateRows: `repeat(${numQuarterHours}, minmax(20px, 1fr))`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
