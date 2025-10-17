import { DateRangeProps } from "@/app/_lib/types/date-range-props";

// Import child components
import useCheckMobile from "@/app/_lib/use-check-mobile";
import WeekdayCalendar from "@/app/ui/components/weekday-calendar";
import DateRangeDrawer from "@/app/ui/components/date-range/date-range-drawer";
import DateRangePopover from "@/app/ui/components/date-range/date-range-popover";
import EventTypeSelect from "@/app/ui/components/selectors/event-type-select";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { checkInvalidDateRangeLength } from "@/app/_lib/schedule/utils";

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
        setEventType={setEventType}
        setWeekdayRange={setWeekdayRange}
        setDateRange={setDateRange}
      />
    );
  } else {
    return (
      <div className="mb-4 flex w-full flex-row gap-8">
        <div className="flex flex-col">
          <label htmlFor="date-range-type">Type</label>
          <EventTypeSelect
            eventType={rangeType}
            disabled={editing}
            onEventTypeChange={setEventType}
          />
        </div>
        <div className="flex w-full flex-col justify-center gap-2">
          {eventRange?.type === "specific" ? (
            <>
              <label className="flex items-center gap-2" htmlFor="date-range">
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
