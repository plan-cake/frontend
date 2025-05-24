"use client";

import { useState } from "react";

import TimeDropdown from "../ui/components/time-dropdown";
import DateRangeSelector from "../ui/components/date-range/date-range-selector";
import TimezoneSelect from "../ui/components/timezone-select";
import CustomSelect from "../ui/components/custom-select";
import GridPreviewDialog from "../ui/components/schedule/grid-preview-dialog";

import { EventRange } from "../_types/schedule-types";

export default function Page() {
  const defaultTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [eventRange, setEventRange] = useState<EventRange>({
    type: "specific",
    duration: 60,
    timezone: defaultTZ,
    dateRange: { from: new Date(), to: new Date() },
    timeRange: { from: new Date(), to: new Date() },
  });

  const handleTZChange = (newTZ: string | number) => {
    setEventRange((prev) => ({
      ...prev,
      timezone: newTZ.toString(),
    }));
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
    <div className="flex w-full grow flex-col space-y-2">
      <input
        type="text"
        placeholder="add event name"
        className="w-full border-b-1 border-dblue p-1 text-2xl focus:outline-none md:w-2/4 dark:border-gray-400"
      />
      <div className="flex flex-1 auto-rows-fr grid-cols-12 flex-col place-content-stretch gap-x-2 gap-y-2 md:grid [&>*]:px-2">
        {/* Prompt */}
        <div className="col-span-2 flex items-center text-center font-medium">
          What times and dates is this event?
        </div>

        {/* Date range picker */}
        <div className="col-span-4 flex items-center">
          <DateRangeSelector
            eventRange={eventRange}
            onChangeEventRange={handleEventRangeChange}
          />
        </div>

        {/* From/To */}
        <div className="col-span-2 col-start-1 flex items-center justify-center space-x-4">
          <label className="text-sm font-medium">from</label>
          <TimeDropdown
            defaultTZ={defaultTZ}
            duration={eventRange.duration}
            value={eventRange.timeRange.from}
            onChange={(from) => handleTimeChange("from", from)}
          />
        </div>
        <div className="col-span-2 col-start-1 flex items-center justify-center space-x-4">
          <label className="text-sm font-medium">to</label>
          <TimeDropdown
            defaultTZ={defaultTZ}
            duration={eventRange.duration}
            value={eventRange.timeRange.to}
            onChange={(to) => handleTimeChange("to", to)}
          />
        </div>

        {/* Timezone */}
        <div className="col-span-2 col-start-1 row-span-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Duration</label>
            <CustomSelect
              options={duationOptions}
              value={eventRange.duration}
              onValueChange={handleDurationChange}
            />
          </div>
          <TimezoneSelect
            value={eventRange.timezone}
            onChange={handleTZChange}
          />
        </div>

        <div className="group col-span-10 col-start-3 row-span-9 row-start-2 flex-1">
          <GridPreviewDialog eventRange={eventRange} />

          {/* <div className="mr-4 flex items-center justify-end space-x-2">
            <label className="text-sm font-medium">{timezone}</label>
            <label className="text-sm font-medium">Grid Preview</label>
            <EnterFullScreenIcon className="h-5 w-5 cursor-pointer text-dblue hover:text-red" />
          </div>
          <ScheduleGrid
            eventRange={eventRange}
            disableSelect={true}
            timezone={timezone}
          /> */}
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
