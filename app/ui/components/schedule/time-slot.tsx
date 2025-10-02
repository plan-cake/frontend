"use client";

import React, { memo } from "react";
import { cn } from "@/app/_lib/classname";

interface TimeSlotProps {
  slotIso: string;
  isSelected?: boolean;
  isHovered?: boolean;

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
        "bg-white transition-colors hover:cursor-pointer",
        disableSelect && "cursor-not-allowed",
        isHovered && "ring-2 ring-blue ring-inset dark:ring-red",
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
        style={{
          backgroundColor,
        }}
      />
    </div>
  );
}

export default memo(TimeSlot);
