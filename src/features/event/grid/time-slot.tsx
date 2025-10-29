"use client";

import React, { memo } from "react";

import { cn } from "@/lib/utils/classname";

interface TimeSlotProps {
  slotIso: string;
  isSelected?: boolean;
  isHovered?: boolean;

  disableSelect?: boolean;
  dynamicStyle?: React.CSSProperties & {
    [key: `--${string}`]: string | number;
  };
  gridColumn: number;
  gridRow: number;

  cellClasses?: string;

  // Event handlers
  onPointerDown?: () => void;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onTouchMove?: (e: React.TouchEvent<HTMLDivElement>) => void;
}

function TimeSlot({
  slotIso,
  isHovered,
  disableSelect,
  dynamicStyle: style,
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
        "dark:bg-violet relative bg-white",
        isHovered && "ring-blue dark:ring-red ring-1 ring-inset",
        disableSelect
          ? "pointer-events-none cursor-not-allowed bg-[#FFFFFF] dark:bg-[#343249]"
          : "cursor-cell",
        cellClasses,
      )}
      style={{
        gridColumn,
        gridRow,
        touchAction: "none",
        userSelect: "none",
        ...style,
      }}
      {...eventHandlers}
    />
  );
}

export default memo(TimeSlot);
