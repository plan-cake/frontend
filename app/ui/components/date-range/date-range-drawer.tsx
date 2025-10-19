import * as Dialog from "@radix-ui/react-dialog";

import { DateRangeProps } from "@/app/_lib/types/date-range-props";
import { fromZonedTime } from "date-fns-tz";

import { Calendar } from "@/app/ui/components/month-calendar";
import WeekdayCalendar from "@/app/ui/components/weekday-calendar";
import DateRangeInput from "@/app/ui/components/date-range/date-range-input";
import EventTypeSelect from "@/app/ui/components/selectors/event-type-select";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { checkInvalidDateRangeLength } from "@/app/_lib/schedule/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function DateRangeDrawer({
  earliestDate,
  eventRange,
  editing = false,
  setEventType = () => {},
  setWeekdayRange = () => {},
  setDateRange = () => {},
}: DateRangeProps) {
  const rangeType = eventRange?.type ?? "specific";
  const [tooManyDays, setTooManyDays] = useState(false);

  const checkDateRange = (range: DateRange | undefined) => {
    setTooManyDays(checkInvalidDateRangeLength(range));
    setDateRange(range);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="cursor-pointer" aria-label="Open date range picker">
          <DateRangeDrawerSelector
            eventRange={eventRange}
            setEventType={setEventType}
            tooManyDays={tooManyDays}
          />
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-gray-700/40" />
        <Dialog.Content
          className="fixed right-0 bottom-0 left-0 z-50 flex h-[500px] w-full animate-slideUp flex-col data-[state=closed]:animate-slideDown"
          aria-label="Date range picker"
        >
          <div className="flex-1 justify-center overflow-y-auto rounded-t-4xl bg-white p-8 shadow-lg dark:bg-violet">
            <div
              aria-hidden
              className="sticky mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
            />
            <Dialog.Title className="mb-2 flex flex-row items-center justify-between text-lg font-semibold">
              <label>Select Date Range</label>
              <EventTypeSelect
                eventType={rangeType}
                onEventTypeChange={setEventType}
                disabled={editing}
              />
            </Dialog.Title>

            <DateRangeDrawerSelector
              earliestDate={earliestDate}
              eventRange={eventRange}
              displayCalendar={true}
              setWeekdayRange={setWeekdayRange}
              setDateRange={checkDateRange}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const DateRangeDrawerSelector = ({
  earliestDate,
  eventRange,
  displayCalendar,
  tooManyDays,
  setWeekdayRange = () => {},
  setDateRange = () => {},
}: DateRangeProps) => {
  if (eventRange?.type === "specific") {
    const startDate = fromZonedTime(
      eventRange.dateRange.from,
      eventRange.timezone,
    );
    const endDate = fromZonedTime(eventRange.dateRange.to, eventRange.timezone);
    return (
      <div className="flex flex-col space-y-2">
        {displayCalendar ? (
          <Calendar
            earliestDate={earliestDate}
            selectedRange={{
              from: startDate || undefined,
              to: endDate || undefined,
            }}
            setDateRange={setDateRange}
          />
        ) : (
          <>
            <label className="flex items-center gap-2 text-start">
              Possible Dates
              {tooManyDays && (
                <ExclamationTriangleIcon className="h-4 w-4 text-[#ED7183]" />
              )}
            </label>
            <DateRangeInput startDate={startDate} endDate={endDate} />
          </>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-2">
      {!displayCalendar && <label className="text-start">Dates</label>}
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
        inDrawer={true}
      />
    </div>
  );
};
