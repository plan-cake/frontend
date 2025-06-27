"use client";

import { useMemo } from "react";

interface TimeBlockProps {
  timeColWidth: number;
  rightArrowWidth: number;
  visibleDays: string[];
  startHour: number;
  endHour: number;
  splitBlocks?: boolean;
  blockNumber?: number; // Optional prop to control block splitting
}

export default function TimeBlock({
  timeColWidth,
  rightArrowWidth,
  startHour,
  endHour,
  visibleDays,
  splitBlocks = false, // Optional prop to control block splitting
  blockNumber = 0,
}: TimeBlockProps) {
  console.log("Rendering TimeBlock", {
    timeColWidth,
    rightArrowWidth,
    visibleDays,
    startHour,
    endHour,
  });
  const numHours = endHour - startHour;
  const numQuarterHours = numHours * 4; // 4 quarter hours per hour

  const hoursLabel = useMemo(() => {
    return Array.from({ length: numQuarterHours }, (_, i) => {
      const hour24 = startHour + Math.floor(i / 4);
      const hour12 = hour24 % 12 || 12;
      const period = hour24 < 12 ? "AM" : "PM";
      return `${hour12} ${period}`;
    });
  }, [startHour, numQuarterHours]);

  if (numHours <= 0 || visibleDays.length === 0) return null;

  return (
    <div className="flex grow flex-row">
      {/* Hour Labels Overlay */}
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

      {/* Grid Layer */}
      <div
        className="grid w-full border border-gray-400"
        style={{
          gridTemplateColumns: `repeat(${visibleDays.length}, 1fr)`,
          gridTemplateRows: `repeat(${numQuarterHours}, minmax(20px, 1fr))`,
        }}
      >
        {/* Time slots */}
        {Array.from({ length: numQuarterHours }).map((_, quarterIdx) =>
          visibleDays.map((_, dayIdx) => {
            const isDisabled =
              (splitBlocks && blockNumber === 0 && dayIdx === 0) ||
              (splitBlocks &&
                blockNumber === 1 &&
                dayIdx === visibleDays.length - 1);

            return (
              <div
                key={`slot-${quarterIdx}-${dayIdx}`}
                className={`border-[0.5px] border-gray-300 hover:bg-blue-200 dark:hover:bg-red-200 ${
                  isDisabled ? "pointer-events-none bg-gray-200" : ""
                }`}
                style={{
                  gridColumn: dayIdx + 1,
                  gridRow: quarterIdx + 1,
                }}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
