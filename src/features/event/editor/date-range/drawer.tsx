import { useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { ExclamationTriangleIcon, Cross1Icon } from "@radix-ui/react-icons";
import { fromZonedTime } from "date-fns-tz";
import { DateRange } from "react-day-picker";

import ActionButton from "@/features/button/components/action";
import { DateRangeProps } from "@/features/event/editor/date-range/date-range-props";
import SpecificDateRangeDisplay from "@/features/event/editor/date-range/specific-date-display";
import { Calendar } from "@/features/event/editor/month-calendar";
import { checkInvalidDateRangeLength } from "@/features/event/editor/validate-data";
import WeekdayCalendar from "@/features/event/editor/weekday-calendar";

export default function DateRangeDrawer({
  earliestDate,
  eventRange,
  setDateRange = () => {},
}: DateRangeProps) {
  if (eventRange.type !== "specific") {
    return null;
  }

  const rangeType = eventRange?.type ?? "specific";
  const [tooManyDays, setTooManyDays] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    return true;
  };

  const checkDateRange = (range: DateRange | undefined) => {
    setTooManyDays(checkInvalidDateRangeLength(range));
    setDateRange(range);
  };

  const startDate = fromZonedTime(
    eventRange.dateRange.from,
    eventRange.timezone,
  );
  const endDate = fromZonedTime(eventRange.dateRange.to, eventRange.timezone);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="hover:cursor-pointer">
        <SpecificDateRangeDisplay startDate={startDate} endDate={endDate} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-gray-700/40" />
        <Dialog.Content
          className="animate-slideUp data-[state=closed]:animate-slideDown fixed bottom-0 left-0 right-0 z-50 flex h-[500px] w-full flex-col"
          aria-label="Date range picker"
        >
          <div className="rounded-t-4xl bg-background flex flex-1 flex-col overflow-y-auto shadow-lg">
            <div
              onPointerDown={handleClose}
              className="bg-background sticky top-0 z-10 flex items-center gap-4 p-8 pb-4"
            >
              <ActionButton
                buttonStyle="frosted glass"
                icon={<Cross1Icon />}
                label="Close Drawer"
                shrinkOnMobile
                onClick={handleClose}
              />

              <Dialog.Title className="flex flex-col text-lg font-semibold">
                Select Specific Date Range
                <span className="text-accent text-sm font-normal">
                  Click a start and end date
                </span>
              </Dialog.Title>
            </div>

            <Calendar
              earliestDate={earliestDate}
              className="w-fit"
              selectedRange={{
                from: startDate || undefined,
                to: endDate || undefined,
              }}
              setDateRange={setDateRange}
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
                <ExclamationTriangleIcon className="text-error h-4 w-4" />
              )}
            </label>
            <SpecificDateRangeDisplay startDate={startDate} endDate={endDate} />
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
