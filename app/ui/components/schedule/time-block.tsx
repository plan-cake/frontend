"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  getUtcIsoSlot,
  AvailabilitySet,
  checkDateInRange,
} from "@/app/_types/user-availability";
import { useTheme } from "next-themes";
import { cn } from "@/app/_lib/classname";
import { EventRange } from "@/app/_types/schedule-types";

interface TimeBlockProps {
  mode: "paint" | "view" | "preview";
  disableSelect?: boolean;
  timeColWidth: number;
  rightArrowWidth: number;
  visibleDays: string[];
  startHour: number;
  endHour: number;
  userTimezone: string;
  availability: AvailabilitySet;
  onToggle?: (slotIso: string) => void;
  allAvailabilities?: AvailabilitySet[];
  onHoverSlot?: (iso: string | null) => void;
  hoveredSlot?: string | null;
  eventRange: EventRange;
}

export default function TimeBlock({
  mode,
  disableSelect = false,
  timeColWidth,
  rightArrowWidth,
  startHour,
  endHour,
  visibleDays,
  userTimezone,
  availability,
  onToggle,
  allAvailabilities = [],
  onHoverSlot,
  hoveredSlot,
  eventRange,
}: TimeBlockProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [isDragging, setIsDragging] = useState(false);
  const [didTouch, setDidTouch] = useState(false);
  const draggedSlots = useRef<Set<string>>(new Set());

  useEffect(() => {
    const stopDragging = () => {
      setIsDragging(false);
      setDidTouch(false);
      draggedSlots.current.clear();
    };

    window.addEventListener("mouseup", stopDragging);

    return () => {
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchend", stopDragging);
    };
  }, []);

  console.log(startHour, endHour);
  const numHours = endHour - startHour + 1;
  const numQuarterHours = numHours * 4;

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
        className="grid w-full border border-gray-400 dark:border-gray-600"
        style={{
          gridTemplateColumns: `repeat(${visibleDays.length}, 1fr)`,
          gridTemplateRows: `repeat(${numQuarterHours}, minmax(20px, 1fr))`,
        }}
      >
        {Array.from({ length: numQuarterHours }).map((_, quarterIdx) =>
          visibleDays.map((_, dayIdx) => {
            const isDashedBorder = quarterIdx % 4 !== 0;

            const hour = startHour + Math.floor(quarterIdx / 4);
            const minute = (quarterIdx % 4) * 15;
            const dateKey = visibleDays[dayIdx];
            const { utcDate: date, isoString: slotIso } = getUtcIsoSlot(
              dateKey,
              hour,
              minute,
              userTimezone,
            );

            const isDisabled = checkDateInRange(date, eventRange) === false;

            const matchCount = allAvailabilities.reduce(
              (acc, set) => acc + (set.has(slotIso) ? 1 : 0),
              0,
            );
            const total = allAvailabilities.length || 1;
            const opacity = matchCount / total;
            const isHovered = hoveredSlot === slotIso;
            const isSelected = availability.has(slotIso);

            const backgroundColor =
              mode === "view"
                ? isDark
                  ? opacity === 1
                    ? `rgb(226, 0, 0)`
                    : `rgba(225, 92, 92, ${opacity})`
                  : opacity === 1
                    ? `rgb(0, 107, 188)`
                    : `rgba(61, 115, 163, ${opacity})`
                : isSelected
                  ? isDark
                    ? "rgba(225, 92, 92, 1)"
                    : "rgba(61, 115, 163, 1)"
                  : "transparent";

            return (
              <div
                key={`slot-${quarterIdx}-${dayIdx}`}
                draggable={false}
                onMouseDown={() => {
                  if (mode === "paint") {
                    if (didTouch) return setDidTouch(false);
                    if (!isDisabled && !isDragging) {
                      onToggle?.(slotIso);
                      setIsDragging(true);
                      draggedSlots.current = new Set([slotIso]);
                    }
                  }
                }}
                onMouseEnter={() => {
                  if (mode === "paint") {
                    if (
                      isDragging &&
                      !isDisabled &&
                      !draggedSlots.current.has(slotIso)
                    ) {
                      onToggle?.(slotIso);
                      draggedSlots.current.add(slotIso);
                    }
                  }
                  if (mode === "view") {
                    onHoverSlot?.(slotIso);
                  }
                }}
                onMouseLeave={() => {
                  if (mode === "view") {
                    onHoverSlot?.(null);
                  }
                }}
                onTouchStart={(e) => {
                  if (mode === "paint") {
                    setDidTouch(true);
                    if (!isDisabled) {
                      setIsDragging(true);
                      onToggle?.(slotIso);
                      draggedSlots.current = new Set([slotIso]);
                    }
                  }
                }}
                onTouchMove={(e) => {
                  if (mode === "paint") {
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
                      onToggle?.(target.dataset.slotIso);
                      draggedSlots.current.add(target.dataset.slotIso);
                    }
                  }
                }}
                data-slot-iso={slotIso}
                className={cn(
                  "border-[0.5px] border-gray-300 transition-all",
                  disableSelect
                    ? "cursor-not-allowed"
                    : isSelected
                      ? "bg-blue dark:bg-red"
                      : "hover:bg-blue-200 dark:hover:bg-red-200",
                  isDisabled && "pointer-events-none bg-gray-200",
                  isHovered &&
                    "inset-ring-1 inset-ring-blue dark:inset-ring-red",
                )}
                style={{
                  gridColumn: dayIdx + 1,
                  gridRow: quarterIdx + 1,
                  borderTopStyle: isDashedBorder ? "dashed" : "solid",
                  backgroundColor: isDisabled
                    ? "rgb(209, 204, 204)"
                    : mode === "view"
                      ? backgroundColor
                      : "",
                  touchAction: "none",
                  // Prevent text selection for interactive time blocks
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
