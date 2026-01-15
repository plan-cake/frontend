import { useEffect, useState } from "react";

import {
  TimePickerRoot,
  TimePickerWheel,
  TimePickerSeparator,
} from "@poursha98/react-ios-time-picker";

import { convert12To24, convert24To12 } from "@/lib/utils/date-time-format";

type TimePickerProps = {
  time: string;
  onTimeChange: (newTime: string) => void;
  visibleCount?: number;
  fontSize?: number;
};

export default function TimePicker({
  time,
  onTimeChange,
  visibleCount = 3,
  fontSize = 16,
}: TimePickerProps) {
  // pickerValue acts as our "previous" state during changes
  const [pickerValue, setPickerValue] = useState(convert24To12(time));

  // Sync internal state if the external prop changes
  useEffect(() => {
    setPickerValue(convert24To12(time));
  }, [time]);

  const handleChange = (newTime12: string) => {
    const [oldHourStr, oldRest] = pickerValue.split(":");
    const oldHour = parseInt(oldHourStr, 10);
    const oldPeriod = oldRest.split(" ")[1];

    const [newHourStr, newRest] = newTime12.split(":");
    const newHour = parseInt(newHourStr, 10);
    const newMinute = newRest.split(" ")[0];
    const newPeriod = newRest.split(" ")[1];

    let finalTime = newTime12;

    // Only run auto-flip logic if the user didn't manually change the period
    if (oldPeriod === newPeriod && oldHour !== newHour) {
      // 1. Normalize hours to 0-11 range (12 becomes 0) for easier math
      const o = oldHour === 12 ? 0 : oldHour;
      const n = newHour === 12 ? 0 : newHour;

      // 2. Calculate circular distance (how many steps forward?)
      // Examples: 10->12 is diff 2. 1->11 is diff 10.
      const diff = (n - o + 12) % 12;

      // 3. Determine if we crossed the 11->12 (or 12->11) boundary
      let crossedBoundary = false;

      if (diff > 0 && diff <= 6) {
        // Forward movement (e.g., 10 -> 12)
        // If we moved forward but the number got smaller (e.g., 11 -> 0), we wrapped.
        if (n < o) crossedBoundary = true;
      } else if (diff > 6) {
        // Backward movement (e.g., 1 -> 11)
        // If we moved backward but the number got bigger (e.g., 0 -> 11), we wrapped.
        if (n > o) crossedBoundary = true;
      }

      if (crossedBoundary) {
        const toggledPeriod = newPeriod === "AM" ? "PM" : "AM";
        finalTime = `${newHourStr}:${newMinute} ${toggledPeriod}`;
      }
    }

    setPickerValue(finalTime);
    onTimeChange(convert12To24(finalTime));
  };

  const wheelStyle = {
    root: { display: "flex", width: "fit-content", padding: "0 8px" },
    item: { fontSize: `${fontSize}px` },
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
      value={pickerValue}
      onChange={handleChange}
      minuteStep={15}
      visibleCount={visibleCount}
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
