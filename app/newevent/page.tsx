"use client";

import { useState } from "react";

import TimeDropdown from "../ui/components/time-dropdown";
import ScheduleGrid from "../ui/components/schedule-grid";
import { TimeDateRange, WeekdayMap } from "../_types/schedule-types";
import DateRangeSelector from "../ui/components/date-range/date-range-selector";
import TimezoneSelect from "../ui/components/timezone-select";
import { EnterFullScreenIcon } from "@radix-ui/react-icons";

export default function Page() {
  const defaultTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [timezone, setTimezone] = useState(defaultTZ);

  const [selectedTime, setSelectedTime] = useState<TimeDateRange>({
    from: new Date(),
    to: new Date(),
  });

  const [rangeType, setRangeType] = useState<"specific" | "weekday">(
    "specific",
  );

  const [specificRange, setSpecificRange] = useState<TimeDateRange>({
    from: new Date(),
    to: new Date(),
  });

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = WEEKDAYS[new Date().getDay()];

  const [weekdayRange, setWeekdayRange] = useState<WeekdayMap>(() =>
    WEEKDAYS.reduce((acc, day) => {
      acc[day] = day === today ? 1 : 0;
      return acc;
    }, {} as WeekdayMap),
  );

  const handleWeekdayRangeChange = (newRange: WeekdayMap) => {
    setWeekdayRange(newRange);
  };

  const handleSpecificRangeChange = (range: TimeDateRange) => {
    setSpecificRange({
      from: range.from ? new Date(range.from) : null,
      to: range.to ? new Date(range.to) : null,
    });
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
          rangeType={rangeType}
          onChangeRangeType={setRangeType}
          specificRange={specificRange}
          onChangeSpecific={handleSpecificRangeChange}
          weekdayRange={weekdayRange}
          onChangeWeekday={handleWeekdayRangeChange}
        />

        <div className="flex flex-col gap-2 md:items-center md:p-4">
          <div className="flex gap-2 md:flex-col md:items-center">
            <TimeDropdown
              defaultTZ={defaultTZ}
              value={selectedTime.from}
              onChange={(from) => setSelectedTime({ ...selectedTime, from })}
            />
            {"to"}
            <TimeDropdown
              defaultTZ={defaultTZ}
              value={selectedTime.to}
              onChange={(to) => setSelectedTime({ ...selectedTime, to })}
            />
          </div>
          <TimezoneSelect value={timezone} onChange={setTimezone} />
        </div>
        <div className="group h-full space-y-4 rounded border border-transparent p-4 hover:border-dblue dark:hover:border-white">
          <div className="mr-4 flex items-center justify-end space-x-2">
            <label className="text-sm font-medium">{timezone}</label>
            <label className="text-sm font-medium">Grid Preview</label>
            <EnterFullScreenIcon className="h-5 w-5 cursor-pointer text-dblue hover:text-red" />
          </div>
          <ScheduleGrid
            isGenericWeek={rangeType == "weekday"}
            disableSelect={true}
            timeRange={{
              from: selectedTime.from || new Date(),
              to: selectedTime.to || new Date(),
            }}
            dateRange={{
              from: specificRange?.from || new Date(),
              to: specificRange?.to || new Date(),
            }}
            weekdays={Object.entries(weekdayRange)
              .filter(([, v]) => v === 1)
              .map(([day]) => day)}
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
