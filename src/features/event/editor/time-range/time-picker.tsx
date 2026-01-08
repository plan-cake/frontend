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
};

export default function TimePicker({
  time,
  onTimeChange,
  visibleCount = 3,
}: TimePickerProps) {
  const [pickerValue, setPickerValue] = useState(convert24To12(time));

  // Sync internal state if the external prop changes
  useEffect(() => {
    setPickerValue(convert24To12(time));
  }, [time]);

  const handleChange = (newTime12: string) => {
    setPickerValue(newTime12);

    const time24 = convert12To24(newTime12);
    onTimeChange(time24);
  };

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
