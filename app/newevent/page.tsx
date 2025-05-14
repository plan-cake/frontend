"use client";

import { useState } from "react";

import TimeDropdown from "../ui/components/time-dropdown";
import ScheduleGrid from "../ui/components/schedule-grid";
import DateRangeSelector from "../ui/components/date-range/date-range-selector";
import TimezoneSelect from "../ui/components/timezone-select";
import { EnterFullScreenIcon } from "@radix-ui/react-icons";
import CustomSelect from "../ui/components/custom-select";

import { EventRange } from "../_types/schedule-types";

export default function Page() {
  const defaultTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [timezone, setTimezone] = useState(defaultTZ);

  const [eventRange, setEventRange] = useState<EventRange>({
    type: "specific",
    duration: 60,
    dateRange: { from: new Date(), to: new Date() },
    timeRange: { from: new Date(), to: new Date() },
  });

  const handleTZChange = (newTZ: string | number) => {
    setTimezone(newTZ.toString());
  };

  const duationOptions = [
    { label: "30 minutes", value: 30 },
    { label: "45 minutes", value: 45 },
    { label: "1 hour", value: 60 },
  ];

  const handleDurationChange = (newDuration: string | number) => {
    const duration = Number(newDuration);
    setEventRange((prev) => ({
      ...prev,
      duration,
    }));
  };

  const handleTimeChange = (key: "from" | "to", value: Date) => {
    setEventRange((prev) => ({
      ...prev,
      timeRange: {
        ...prev.timeRange,
        [key]: value,
      },
    }));
  };

  const handleEventRangeChange = (range: EventRange) => {
    setEventRange(range);
  };

  return (
    <div className="relative mt-2 h-[70vh] w-full space-y-6">
      <input
        type="text"
        placeholder="add event name"
        className="w-full border-b-1 border-dblue p-1 text-2xl focus:outline-none md:w-2/4 dark:border-gray-400"
      />
      <div
        className="flex h-full w-full flex-col space-y-4 md:grid"
        style={{
          gridTemplateColumns: `min(18vw, 200px) auto`,
          gridTemplateRows: `50px auto`,
        }}
      >
        <div>
          <p className="font-bold md:pr-4 md:pl-4 md:text-center">
            What times and dates is this event?
          </p>
        </div>

        <DateRangeSelector
          eventRange={eventRange}
          onChangeEventRange={handleEventRangeChange}
        />

        <div className="flex flex-col gap-2 md:items-center md:p-4">
          <label className="text-sm font-medium">Duration</label>
          <CustomSelect
            options={duationOptions}
            value={eventRange.duration}
            onValueChange={handleDurationChange}
          />
          <div className="flex gap-2 md:flex-col md:items-center">
            <TimeDropdown
              defaultTZ={defaultTZ}
              duration={eventRange.duration}
              value={eventRange.timeRange.from}
              onChange={(from) => handleTimeChange("from", from)}
            />
            {"to"}
            <TimeDropdown
              defaultTZ={defaultTZ}
              duration={eventRange.duration}
              value={eventRange.timeRange.to}
              onChange={(to) => handleTimeChange("to", to)}
            />
          </div>
          <TimezoneSelect value={timezone} onChange={handleTZChange} />
        </div>
        <div className="group h-full space-y-4 rounded border border-transparent p-4 hover:border-dblue dark:hover:border-white">
          <div className="mr-4 flex items-center justify-end space-x-2">
            <label className="text-sm font-medium">{timezone}</label>
            <label className="text-sm font-medium">Grid Preview</label>
            <EnterFullScreenIcon className="h-5 w-5 cursor-pointer text-dblue hover:text-red" />
          </div>
          <ScheduleGrid
            eventRange={eventRange}
            disableSelect={true}
            timezone={timezone}
          />
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          div[style] {
            grid-template-rows: 80px auto !important;
          }
        }
      `}</style>
    </div>
  );
}
