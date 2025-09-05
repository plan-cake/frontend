"use client";

import React, { memo } from "react";
import { cn } from "@/app/_lib/classname";

interface TimeSlotProps {
  slotIso: string;
  isSelected: boolean;
  isHovered: boolean;

  disableSelect: boolean;
  isDisabled: boolean;
  isDashedBorder: boolean;
  backgroundColor: string;
  gridColumn: number;
  gridRow: number;

  // Event handlers
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
}

function TimeSlot({
  slotIso,
  isSelected,
  isHovered,
  isDisabled,
  disableSelect,
  isDashedBorder,
  backgroundColor,
  gridColumn,
  gridRow,
  ...eventHandlers
}: TimeSlotProps) {
  return (
    <div
      data-slot-iso={slotIso}
      draggable={false}
      className={cn(
        "border-[0.5px] border-gray-300 transition-all hover:cursor-pointer dark:border-gray-600",
        disableSelect
          ? "cursor-not-allowed"
          : isSelected
            ? "bg-blue dark:bg-red"
            : "hover:bg-blue-200 dark:hover:bg-red-200",
        isDisabled && "pointer-events-none bg-gray-200",
        isHovered && "ring-2 ring-blue ring-inset dark:ring-red",
      )}
      style={{
        gridColumn,
        gridRow,
        borderTopStyle: isDashedBorder ? "dashed" : "solid",
        touchAction: "none",
        userSelect: "none",
      }}
      {...eventHandlers}
    />
  );
}

export default memo(TimeSlot);
