import { useState } from "react";
import { DateRange } from "react-day-picker";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import useCheckMobile from "@/lib/hooks/use-check-mobile";
import { DateRangeProps } from "@/features/event/editor/date-range/date-range-props";
import { checkInvalidDateRangeLength } from "@/features/event/editor/validate-data";

import WeekdayCalendar from "@/features/event/editor/weekday-calendar";
import DateRangeDrawer from "@/features/event/editor/date-range/drawer";
import DateRangePopover from "@/features/event/editor/date-range/popover";
import EventTypeSelect from "@/features/event/editor/event-type-select";

export default function DateRangeSelector({
  earliestDate,
  eventRange,
  editing = false,
  setEventType = () => {},
  setWeekdayRange = () => {},
  setDateRange = () => {},
}: DateRangeProps) {
  const isMobile = useCheckMobile();
  const rangeType = eventRange?.type ?? "specific";
  const [tooManyDays, setTooManyDays] = useState(false);

  const checkDateRange = (range: DateRange | undefined) => {
    setTooManyDays(checkInvalidDateRangeLength(range));
    setDateRange(range);
  };

  if (isMobile) {
    return (
      <DateRangeDrawer
        earliestDate={earliestDate}
        eventRange={eventRange}
        editing={editing}
        setEventType={setEventType}
        setWeekdayRange={setWeekdayRange}
        setDateRange={setDateRange}
      />
    );
  } else {
    return (
      <div className="mb-4 flex w-full flex-row gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="event-type-select">Type</label>
          <EventTypeSelect
            id="event-type-select"
            eventType={rangeType}
            disabled={editing}
            onEventTypeChange={setEventType}
          />
        </div>
        <div className="flex w-full flex-col justify-center gap-2">
          {eventRange?.type === "specific" ? (
            <>
              <label className="flex items-center gap-2">
                Possible Dates
                {tooManyDays && (
                  <ExclamationTriangleIcon className="h-4 w-4 text-[#ED7183]" />
                )}
              </label>
              <DateRangePopover
                earliestDate={earliestDate}
                eventRange={eventRange}
                setDateRange={checkDateRange}
              />
            </>
          ) : (
            <WeekdayCalendar
              selectedDays={
                eventRange?.weekdays ?? {
                  Sun: 0,
                  Mon: 0,
                  Tue: 0,
                  Wed: 0,
                  Thu: 0,
                  Fri: 0,
                  Sat: 0,
                }
              }
              onChange={setWeekdayRange}
            />
          )}
        </div>
      </div>
    );
  }
}
