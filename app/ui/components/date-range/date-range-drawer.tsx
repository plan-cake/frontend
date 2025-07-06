import * as Dialog from "@radix-ui/react-dialog";
import { Calendar } from "../month-calendar";
import CustomSelect from "../custom-select";
import WeekdayCalendar from "../weekday-calendar";
import DateRangeInput from "./date-range-input";
import { DateRangeProps } from "@/app/_types/date-range-types";

export default function DateRangeDrawer({
  eventRange,
  onChangeRangeType,
  onChangeSpecific,
  onChangeWeekday,
}: DateRangeProps) {
  const rangeType = eventRange?.type ?? "specific";

  const select = (
    <CustomSelect
      options={[
        { label: "Specific Dates", value: "specific" },
        { label: "Days of the Week", value: "weekday" },
      ]}
      value={rangeType === "specific" ? "Specific Dates" : "Days of the Week"}
      onValueChange={(value) =>
        onChangeRangeType?.(value === "Specific Dates" ? "specific" : "weekday")
      }
      className="min-h-9 min-w-[100px] border-none px-2"
    />
  );
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="cursor-pointer" aria-label="Open date range picker">
          <DateRangeDrawerSelector
            eventRange={eventRange}
            onChangeSpecific={onChangeSpecific}
            onChangeWeekday={onChangeWeekday}
          />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-gray-700/40" />
        <Dialog.Content
          className="flex-coldata-[state=closed]:animate-slideDown fixed right-0 bottom-0 left-0 z-50 flex h-[500px] w-full animate-slideUp"
          aria-label="Date range picker"
        >
          <div className="flex-1 justify-center overflow-y-auto rounded-t-4xl bg-white p-8 shadow-lg dark:bg-violet">
            <div
              aria-hidden
              className="sticky mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
            />
            <Dialog.Title className="mb-2 flex flex-row items-center justify-between text-lg font-semibold">
              Select Date Range
              {select}
            </Dialog.Title>

            <DateRangeDrawerSelector
              eventRange={eventRange}
              onChangeSpecific={onChangeSpecific}
              onChangeWeekday={onChangeWeekday}
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
  onChangeSpecific,
  onChangeWeekday = () => {},
  displayCalendar = false,
}: DateRangeProps) => {
  if (eventRange?.type === "specific") {
    const specificRange = eventRange.dateRange;
    return (
      <div className="flex flex-col space-y-2">
        {displayCalendar ? (
          <Calendar
            selectedRange={{
              from: specificRange.from || undefined,
              to: specificRange.to || undefined,
            }}
            onRangeSelect={(range) => {
              if (range?.from) {
                onChangeSpecific?.("from", range.from);
              }
              if (range?.to) {
                onChangeSpecific?.("to", range.to);
              }
            }}
          />
        ) : (
          <>
            <label className="text-start">Possible Dates</label>
            <DateRangeInput
              specificRange={specificRange}
              onChangeSpecific={onChangeSpecific}
            />
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
        onChange={onChangeWeekday}
      />
    </div>
  );
};
