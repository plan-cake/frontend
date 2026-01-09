"use client";

import { useState } from "react";

import {
  TimePickerRoot,
  TimePickerWheel,
  TimePickerSeparator,
} from "@poursha98/react-ios-time-picker";

export default function TimeRangeSelection() {
  const [time, setTime] = useState("02:30 PM");

  const wheelStyle = {
    root: { display: "flex", width: "fit-content", padding: "0 8px" },
    item: { fontSize: "16px" },
    overlayTop: {
      background:
        "linear-gradient(to bottom, color-mix(in srgb, var(--color-background), transparent 20%) 5%, transparent)",
    },
    overlayBottom: {
      background:
        "linear-gradient(to top, color-mix(in srgb, var(--color-background), transparent 20%) 5%, transparent)",
    },
  };

  return (
    <TimePickerRoot
      value={time}
      onChange={setTime}
      minuteStep={15}
      visibleCount={3}
      className="w-full !p-0"
      is12Hour
      loop
    >
      <div className="relative mx-auto flex w-full items-center justify-center">
        <div className="bg-accent/20 pointer-events-none absolute left-0 top-1/2 z-10 h-10 w-full -translate-y-1/2 rounded-full" />

        <div className="flex items-center">
          <TimePickerWheel
            type="hour"
            className="w-fit !min-w-0 !flex-none"
            styles={wheelStyle}
          />
          <TimePickerSeparator className="w-fit !min-w-0 !flex-none !text-base">
            :
          </TimePickerSeparator>
          <TimePickerWheel
            type="minute"
            className="w-fit !min-w-0 !flex-none"
            styles={wheelStyle}
          />
          <TimePickerWheel
            type="period"
            className="w-fit !min-w-0 !flex-none"
            styles={wheelStyle}
          />
        </div>
      </div>
    </TimePickerRoot>
  );
}
