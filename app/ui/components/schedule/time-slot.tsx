"use client";

import React, { memo } from "react";
import { cn } from "@/app/_lib/classname";

interface TimeSlotProps {
  slotIso: string;
  isSelected: boolean;
  isHovered: boolean;

  disableSelect: boolean;
  backgroundColor: string;
  gridColumn: number;
  gridRow: number;

  cellClasses?: string;

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
        "transition-colors hover:cursor-pointer",
        disableSelect
          ? "cursor-not-allowed"
          : isSelected
            ? "bg-blue dark:bg-red"
            : "hover:bg-blue-200 dark:hover:bg-red-200",
        isHovered && "ring-2 ring-blue ring-inset dark:ring-red",
      )}
      style={{
        backgroundColor,
        gridColumn,
        gridRow,
        touchAction: "none",
        userSelect: "none",
      }}
      {...eventHandlers}
    />
  );
}

export default memo(TimeSlot);
