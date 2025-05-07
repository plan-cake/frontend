"use client";

import { useState } from "react";

import TimeDropdown from "../ui/components/time-dropdown";
import DateRangePopover from "../ui/components/date-range-popover";
import WeekdayCalendar from "../ui/components/weekday-calendar";
import ScheduleGrid from "../ui/components/schedule-grid";
import { TimeDateRange, WeekdayMap } from "../_types/schedule-types";

export default function Page() {
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
    <div className="relative h-[70vh] w-full space-y-6">
      <input
        type="text"
        placeholder="add event name"
        className="w-auto border-b-1 border-dblue p-1 text-2xl focus:outline-none md:w-2/4"
      />
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `200px auto`,
          gridTemplateRows: `50px auto`,
        }}
      >
        <div>
          <p className="pr-4 pl-4 text-center font-bold">
            What times and dates is this event?
          </p>
        </div>
        <div className="mb-4 flex w-fit flex-col space-y-2 space-x-20 pl-4 md:flex-row">
          <select
            name="dates"
            id="dates"
            className="h-fit w-fit rounded-full border-1 border-gray-300 p-2 focus:outline-none"
            onChange={(e) =>
              setRangeType(e.target.value === "1" ? "specific" : "weekday")
            }
          >
            <option value="1">Specific Dates</option>
            <option value="2">Days of the Week</option>
          </select>

          {rangeType === "specific" &&
          specificRange?.from &&
          specificRange?.to ? (
            <DateRangePopover
              specificRange={specificRange}
              onChangeSpecific={handleSpecificRangeChange}
            />
          ) : (
            <WeekdayCalendar
              selectedDays={weekdayRange}
              onChange={handleWeekdayRangeChange}
            />
          )}
        </div>
        <div className="flex flex-col items-center gap-2 p-4">
          <TimeDropdown
            value={selectedTime.from}
            onChange={(from) => setSelectedTime({ ...selectedTime, from })}
          />
          {"to"}
          <TimeDropdown
            value={selectedTime.to}
            onChange={(to) => setSelectedTime({ ...selectedTime, to })}
          />
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
        />
      </div>
    </div>
  );
}
