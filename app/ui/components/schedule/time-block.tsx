"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { getUtcIsoSlot, AvailabilitySet } from "@/app/_types/user-availability";

interface TimeBlockProps {
  disableSelect?: boolean;
  timeColWidth: number;
  rightArrowWidth: number;
  visibleDays: string[];
  startHour: number;
  endHour: number;
  splitBlocks?: boolean;
  blockNumber?: number;
  userTimezone: string; // user’s local timezone
  availability: AvailabilitySet; // ISO UTC strings
  highlights: AvailabilitySet;
  onClick: (toggleStatus: boolean, slotIso: string) => void;
  onHover: (slotIso: string) => void;
  onRelease: () => void;
}

export default function TimeBlock({
  disableSelect = false,
  timeColWidth,
  rightArrowWidth,
  startHour,
  endHour,
  visibleDays,
  splitBlocks = false,
  blockNumber = 0,
  userTimezone,
  availability,
  highlights,
  onClick,
  onHover,
  onRelease,
}: TimeBlockProps) {
  const [isTapping, setIsTapping] = useState(false);

  const setIsMobile = () => {
    setIsTapping(true);
    window.removeEventListener("mouseup", release);
  };

  const release = () => {
    onRelease();
    window.removeEventListener("mouseup", release);
    window.removeEventListener("touchend", release);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("mouseup", release);
      window.removeEventListener("touchend", release);
    };
  }, []);

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

            const isDashedBorder = quarterIdx % 4 !== 0; // Dashed border for 15, 30, and 45 minute marks

            const hour = startHour + Math.floor(quarterIdx / 4);
            const minute = (quarterIdx % 4) * 15;
            const dateKey = visibleDays[dayIdx];
            const slotIso = getUtcIsoSlot(dateKey, hour, minute, userTimezone);
            const isSelected = availability.has(slotIso);
            const isHighlighted = highlights.has(slotIso);

            // Removed debug log to avoid noisy logs in production

            return (
              <div
                key={`slot-${quarterIdx}-${dayIdx}`}
                draggable={false}
                onMouseDown={() => {
                  if (isTapping) return;
                  onClick(isSelected, slotIso);
                  window.addEventListener("mouseup", release);
                }}
                onMouseEnter={() => {
                  if (isTapping) return;
                  onHover(slotIso);
                }}
                onTouchStart={(e) => {
                  setIsMobile();
                  onClick(isSelected, slotIso);
                  window.addEventListener("touchend", release);
                }}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const target = document.elementFromPoint(
                    touch.clientX,
                    touch.clientY,
                  );
                  if (target instanceof HTMLElement && target.dataset.slotIso) {
                    onHover(target.dataset.slotIso);
                  }
                }}
                data-slot-iso={slotIso}
                className={`border-[0.5px] border-gray-300 ${
                  isHighlighted
                    ? "bg-blue-200 dark:bg-red-200"
                    : isSelected
                      ? "bg-blue-500 dark:bg-red"
                      : ""
                } ${isDisabled ? "pointer-events-none bg-gray-200" : ""} ${
                  disableSelect ? "cursor-not-allowed" : ""
                }`}
                style={{
                  gridColumn: dayIdx + 1,
                  gridRow: quarterIdx + 1,
                  borderTopStyle: isDashedBorder ? "dashed" : "solid",
                  touchAction: "none",
                  userSelect: "none",
                }}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
