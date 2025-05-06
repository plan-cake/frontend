"use client";

import { useState } from "react";

import { Calendar } from "../ui/components/month-calendar";
import TimeDropdown from "../ui/components/time-dropdown";
import WeekdayCalendar from "../ui/components/weekday-calendar";
import ScheduleGrid from "../ui/components/schedule-grid";
import { format } from "date-fns";
import { spec } from "node:test/reporters";

type DateRangeString = {
  from: string | null;
  to: string | null;
};

type TimeDateRange = {
  from: Date | null;
  to: Date | null;
};

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
  const [weekdayRange, setWeekdayRange] = useState<string[]>([]);

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleSpecificRangeChange = (range: TimeDateRange) => {
    setSpecificRange({
      from: range.from ? new Date(range.from) : null,
      to: range.to ? new Date(range.to) : null,
    });
  };

  const handleWeekdayRangeChange = (days: string[]) => {
    setWeekdayRange(days);
  };

  return (
    <>
      <input
        type="text"
        placeholder="add event name"
        className="w-auto border-b-1 border-dblue p-1 text-2xl focus:outline-none md:w-2/4"
      />
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="mt-6 w-fit space-y-2 md:w-1/2">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <p className="font-bold">What times is this event?</p>
            <div className="flex items-center gap-2">
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
          </div>
          <div>
            <p className="font-bold">What dates are you thinking?</p>
            <div className="mb-4 flex flex-col justify-between space-y-2 md:flex-row">
              <select
                name="dates"
                id="dates"
                className="w-fit rounded-full border-1 border-gray-300 p-2 focus:outline-none"
                onChange={(e) =>
                  setRangeType(e.target.value === "1" ? "specific" : "weekday")
                }
              >
                <option value="1">Specific Dates</option>
                <option value="2">Days of the Week</option>
              </select>

              <div>
                {rangeType === "specific" &&
                specificRange?.from &&
                specificRange?.to ? (
                  <form className="ma2 w-full rounded-full">
                    <input
                      size={10}
                      placeholder="Start Day"
                      value={format(specificRange.from, "EEE, MMM d")}
                      onChange={(e) =>
                        setSpecificRange({
                          ...specificRange,
                          from: new Date(e.target.value),
                        })
                      }
                      className="rounded-l-full border-1 border-dblue-500 px-4 py-1 text-center hover:border-red focus:outline-none"
                    />
                    <input
                      size={10}
                      placeholder="End Day"
                      value={format(specificRange.to, "EEE, MMM d")}
                      onChange={(e) =>
                        setSpecificRange({
                          ...specificRange,
                          to: new Date(e.target.value),
                        })
                      }
                      className="rounded-r-full border-1 border-dblue-500 px-4 py-1 text-center hover:border-red focus:outline-none"
                    />
                  </form>
                ) : rangeType === "weekday" && weekdayRange.length > 0 ? (
                  `Selected: ${WEEKDAYS.filter((d) => weekdayRange.includes(d)).join(", ")}`
                ) : (
                  "No range selected"
                )}
              </div>
            </div>

            {rangeType === "specific" ? (
              <Calendar
                className="w-fit"
                onRangeSelect={(from, to) =>
                  handleSpecificRangeChange({ from, to })
                }
              />
            ) : (
              <WeekdayCalendar
                selectedDays={weekdayRange}
                days={WEEKDAYS}
                onChange={handleWeekdayRangeChange}
              />
            )}
          </div>
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
          weekdays={weekdayRange}
        />
      </div>
    </>
  );
}
