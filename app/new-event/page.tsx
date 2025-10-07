"use client";

import { useReducer } from "react";
import { EventRange } from "@/app/_lib/schedule/types";
import { EventRangeReducer } from "@/app/_lib/event-range-reducer";

// import TimezoneSelect, { type ITimezone } from "react-timezone-select";

import TimeDropdown from "@/app/ui/components/time-dropdown";
import DateRangeSelector from "@/app/ui/components/date-range/date-range-selector";
import TimezoneSelect from "@/app/ui/components/timezone-select";
import CustomSelect from "@/app/ui/components/custom-select";
import GridPreviewDialog from "@/app/ui/components/schedule/grid-preview-dialog";
import { ITimezone } from "react-timezone-select";

const initialEventRange: EventRange = {
  type: "specific",
  duration: 60,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateRange: {
    from: new Date().toISOString(),
    to: new Date().toISOString(),
  },
  timeRange: {
    from: 9,
    to: 17,
  },
};

export default function Page() {
  const defaultTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [eventRange, dispatch] = useReducer(
    EventRangeReducer,
    initialEventRange,
  );

  const durationOptions = [
    { label: "30 minutes", value: 30 },
    { label: "45 minutes", value: 45 },
    { label: "1 hour", value: 60 },
  ];

  const handleTZChange = (new_timezone: string | number) => {
    if (!new_timezone) return;
    if (typeof new_timezone !== "string") return;
    dispatch({ type: "SET_TIMEZONE", payload: new_timezone });
  };

  const handleDurationChange = (new_duration: number | string) => {
    if (!new_duration) return;
    if (typeof new_duration !== "number") return;
    dispatch({ type: "SET_DURATION", payload: new_duration });
  };

  const handleTimeChange = (key: "from" | "to", value: number) => {
    dispatch({
      type: "SET_TIME_RANGE",
      payload: {
        ...eventRange.timeRange,
        [key]: value,
      },
    });
  };

  return (
    <div className="flex h-full w-full grow flex-col space-y-4 md:space-y-8">
      <input
        type="text"
        placeholder="add event name"
        className="w-full border-b-1 border-violet p-1 text-2xl focus:outline-none md:w-2/4 dark:border-gray-400"
      />
      <div className="grid w-full grid-cols-1 gap-y-2 md:grow md:grid-cols-[auto_repeat(10,minmax(0,1fr))] md:grid-rows-[auto_repeat(15,minmax(0,1fr))] md:gap-x-4 md:gap-y-1">
        {/* Date range picker */}
        <div className="flex items-center md:col-span-5">
          <DateRangeSelector eventRange={eventRange} dispatch={dispatch} />
        </div>

        {/* From/To */}
        <label className="md:col-start-1 md:row-start-2"> Possible Times</label>
        <div className="flex space-x-4 md:col-start-1 md:row-start-3">
          <label className="text-gray-400">FROM</label>
          <TimeDropdown
            defaultTZ={defaultTZ}
            duration={eventRange.duration}
            value={eventRange.timeRange.from}
            onChange={(from) => handleTimeChange("from", from)}
          />
        </div>
        <div className="flex space-x-4 md:col-start-1 md:row-start-4">
          <label className="text-gray-400">UNTIL</label>
          <TimeDropdown
            defaultTZ={defaultTZ}
            duration={eventRange.duration}
            value={eventRange.timeRange.to}
            onChange={(to) => handleTimeChange("to", to)}
          />
        </div>

        {/* Timezone & Duration */}
        <div className="md:contents">
          {/* Desktop: show all options */}
          <label
            htmlFor="Advanced Option"
            className="hidden md:col-start-1 md:row-start-12 md:block"
          >
            Advanced Options
          </label>
          <label
            htmlFor="timezone"
            className="hidden text-gray-400 md:col-start-1 md:row-start-13 md:block"
          >
            Timezone
          </label>
          <div className="hidden md:col-start-1 md:row-start-14 md:block">
            <TimezoneSelect
              value={eventRange.timezone}
              onChange={handleTZChange}
            />
          </div>
          <label className="hidden text-gray-400 md:col-start-1 md:row-start-15 md:block">
            Duration
          </label>
          <div className="hidden md:col-start-1 md:row-start-16 md:block">
            <CustomSelect
              options={durationOptions}
              value={eventRange.duration}
              onValueChange={handleDurationChange}
            />
          </div>

          {/* Mobile: expandable section */}
          <details className="block md:hidden">
            <summary className="cursor-pointer rounded px-1 py-2 font-medium">
              Advanced Options
            </summary>
            <div className="mt-2 flex flex-col gap-1">
              <label htmlFor="timezone" className="text-gray-400">
                Timezone
              </label>
              <TimezoneSelect
                value={eventRange.timezone}
                onChange={handleTZChange}
              />
              <label className="text-gray-400">Duration</label>
              <CustomSelect
                options={durationOptions}
                value={eventRange.duration}
                onValueChange={handleDurationChange}
              />
            </div>
          </details>
        </div>

        <div className="hidden flex-1 md:col-span-10 md:col-start-2 md:row-span-15 md:row-start-2 md:block">
          <GridPreviewDialog eventRange={eventRange} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 md:hidden">
        <GridPreviewDialog eventRange={eventRange} />
      </div>
    </div>
  );
}
