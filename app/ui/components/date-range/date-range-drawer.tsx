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
      options={["Specific Dates", "Days of the Week"]}
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
        <div className="cursor-pointer">
          <DateRangeDrawerSelector
            eventRange={eventRange}
            onChangeSpecific={onChangeSpecific}
            onChangeWeekday={onChangeWeekday}
          />
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content
          className="fixed right-0 bottom-0 left-0 z-50 flex h-[500px] w-full animate-slideUp flex-col data-[state=closed]:animate-slideDown"
          aria-label="Date range picker"
        >
          <div className="flex-1 justify-center overflow-y-auto rounded-md rounded-t-[10px] bg-white p-4 shadow-lg dark:bg-dblue">
            <div
              aria-hidden
              className="sticky mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
            />
            <Dialog.Title className="mb-2 flex flex-row items-center justify-between text-lg font-semibold text-gray-900 dark:text-white">
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
      <div className="flex flex-col space-y-2 space-x-20 md:flex-row md:pl-4">
        <DateRangeInput
          specificRange={specificRange}
          onChangeSpecific={onChangeSpecific}
        />
        {displayCalendar && (
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
        )}
      </div>
    );
  }
  return (
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
  );
};
