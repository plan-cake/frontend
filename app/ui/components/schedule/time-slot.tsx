"use client";

import React, { memo } from "react";
import { cn } from "@/app/_lib/classname";

interface TimeSlotProps {
  slotIso: string;
  isSelected?: boolean;
  isHovered?: boolean;
  isToggling?: boolean;

  disableSelect?: boolean;
  backgroundColor: string;
  gridColumn: number;
  gridRow: number;

  cellClasses?: string;

  // Event handlers
  onMouseDown?: () => void;
  onMouseEnter?: () => void;
  onTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove?: (e: React.TouchEvent<HTMLDivElement>) => void;
}

function TimeSlot({
  slotIso,
  isSelected,
  isHovered,
  isToggling,
  disableSelect,
  backgroundColor,
  gridColumn,
  gridRow,
  cellClasses = "",
  ...eventHandlers
}: TimeSlotProps) {
  return (
    <div
      data-slot-iso={slotIso}
      draggable={false}
      className={cn(
        cellClasses,
        "relative bg-white hover:cursor-pointer dark:bg-violet",
        isHovered && "ring-1 ring-blue ring-inset dark:ring-red",
        isToggling && "bg-blue-200 dark:bg-red-200",
        disableSelect && "bg-[#FFFFFF] dark:bg-[#343249]",
      )}
      style={{
        gridColumn,
        gridRow,
        touchAction: "none",
        userSelect: "none",
      }}
      {...eventHandlers}
    >
      <div
        className={cn(
          "h-full w-full",
          disableSelect
            ? "cursor-not-allowed"
            : "hover:bg-blue-200 dark:hover:bg-red-200",
        )}
        style={{ backgroundColor }}
      />
    </div>
  );
}

export default memo(TimeSlot);
