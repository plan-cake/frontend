import * as Dialog from "@radix-ui/react-dialog";

import { DateRangeProps } from "@/app/_lib/types/date-range-props";
import { fromZonedTime } from "date-fns-tz";

import { Calendar } from "@/app/ui/components/month-calendar";
import CustomSelect from "@/app/ui/components/custom-select";
import WeekdayCalendar from "@/app/ui/components/weekday-calendar";
import DateRangeInput from "@/app/ui/components/date-range/date-range-input";

export default function DateRangeDrawer({
  eventRange,
  dispatch,
}: DateRangeProps) {
  const rangeType = eventRange?.type ?? "specific";

  const handleRangeTypeChange = (value: "specific" | "weekday") => {
    dispatch({ type: "SET_RANGE_TYPE", payload: value });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="cursor-pointer" aria-label="Open date range picker">
          <DateRangeDrawerSelector
            eventRange={eventRange}
            dispatch={dispatch}
          />
        </button>
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
              <label htmlFor="date-range-type">Select Date Range</label>
              <CustomSelect
                options={[
                  { label: "Specific Dates", value: "specific" },
                  { label: "Days of the Week", value: "weekday" },
                ]}
                value={rangeType === "specific" ? "specific" : "weekday"}
                onValueChange={(value) =>
                  handleRangeTypeChange?.(
                    value === "Specific Dates" ? "specific" : "weekday",
                  )
                }
                className="min-h-9 min-w-[100px] border-none px-2"
              />
            </Dialog.Title>

            <DateRangeDrawerSelector
              eventRange={eventRange}
              dispatch={dispatch}
              displayCalendar={true}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const DateRangeDrawerSelector = ({
  eventRange,
  displayCalendar,
  dispatch,
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
            selectedRange={{
              from: startDate || undefined,
              to: endDate || undefined,
            }}
            dispatch={dispatch}
          />
        ) : (
          <>
            <label className="text-start">Possible Dates</label>
            <DateRangeInput startDate={startDate} endDate={endDate} />
          </>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-2">
      {!displayCalendar && (
        <label className="text-start" htmlFor="date-range">
          Dates
        </label>
      )}
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
        onChange={(map) =>
          dispatch({ type: "SET_WEEKDAYS", payload: { weekdays: map } })
        }
      />
    </div>
  );
};
