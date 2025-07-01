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
  onToggle: (slotIso: string) => void;
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
  onToggle,
}: TimeBlockProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [didTouch, setDidTouch] = useState(false);
  const draggedSlots = useRef<Set<string>>(new Set());

  useEffect(() => {
    const stopDragging = () => {
      setIsDragging(false);
      draggedSlots.current.clear();
    };

    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchend", stopDragging);

    return () => {
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchend", stopDragging);
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

            console.log(slotIso);

            return (
              <div
                key={`slot-${quarterIdx}-${dayIdx}`}
                draggable={false}
                onMouseDown={() => {
                  if (didTouch) return setDidTouch(false);
                  if (!isDisabled && !isDragging) {
                    onToggle(slotIso);
                    setIsDragging(true);
                    draggedSlots.current = new Set([slotIso]);
                  }
                }}
                onMouseEnter={() => {
                  if (
                    isDragging &&
                    !isDisabled &&
                    !draggedSlots.current.has(slotIso)
                  ) {
                    onToggle(slotIso);
                    draggedSlots.current.add(slotIso);
                  }
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setDidTouch(true);
                  if (!isDisabled) {
                    setIsDragging(true);
                    onToggle(slotIso);
                    draggedSlots.current = new Set([slotIso]);
                  }
                }}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const target = document.elementFromPoint(
                    touch.clientX,
                    touch.clientY,
                  );
                  if (
                    target instanceof HTMLElement &&
                    target.dataset.slotIso &&
                    !draggedSlots.current.has(target.dataset.slotIso)
                  ) {
                    onToggle(target.dataset.slotIso);
                    draggedSlots.current.add(target.dataset.slotIso);
                  }
                }}
                data-slot-iso={slotIso}
                className={`border-[0.5px] border-gray-300 ${
                  isSelected
                    ? "bg-blue-500"
                    : "hover:bg-blue-200 dark:hover:bg-red-200"
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
