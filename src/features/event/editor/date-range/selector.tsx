import { useState } from "react";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import * as Switch from "@radix-ui/react-switch";
import { DateRange } from "react-day-picker";

import WeekdayCalendar from "@/features/event/editor/date-range/calendars/weekday";
import { DateRangeProps } from "@/features/event/editor/date-range/date-range-props";
import DateRangeDrawer from "@/features/event/editor/date-range/drawer";
import EventTypeSelect from "@/features/event/editor/date-range/event-type-select";
import DateRangePopover from "@/features/event/editor/date-range/popover";
import { checkInvalidDateRangeLength } from "@/features/event/editor/validate-data";
import FormSelectorField from "@/features/selector/components/selector-field";
import useCheckMobile from "@/lib/hooks/use-check-mobile";

export default function DateRangeSelection({
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

  return (
    <div className="mb-4 flex w-full flex-row gap-8">
      <div className="hidden flex-col gap-2 md:flex">
        <label htmlFor="event-type-select">Type</label>
        <EventTypeSelect
          id="event-type-select"
          eventType={rangeType}
          disabled={editing}
          onEventTypeChange={setEventType}
        />
      </div>
      <div className="flex w-fit flex-col justify-center gap-2">
        <label className="flex items-center gap-2">
          Possible Dates
          {tooManyDays && (
            <ExclamationTriangleIcon className="text-error h-4 w-4" />
          )}
        </label>

        <FormSelectorField
          label="Choose Days of the Week"
          htmlFor="event-type"
          classname="md:hidden"
        >
          <Switch.Root
            id="mode-switch"
            checked={rangeType === "weekday"}
            disabled={editing}
            onCheckedChange={(checked) =>
              setEventType(checked ? "weekday" : "specific")
            }
            className="data-[state=checked]:bg-accent relative h-[25px] w-[50px] cursor-default rounded-full bg-gray-200 shadow-inner outline-none transition-colors"
          >
            <Switch.Thumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px_rgba(0,0,0,0.1)] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[27px]" />
          </Switch.Root>
        </FormSelectorField>

        {eventRange?.type === "specific" ? (
          isMobile ? (
            <DateRangeDrawer
              earliestDate={earliestDate}
              eventRange={eventRange}
              setDateRange={checkDateRange}
            />
          ) : (
            <DateRangePopover
              earliestDate={earliestDate}
              eventRange={eventRange}
              setDateRange={checkDateRange}
            />
          )
        ) : (
          <WeekdayCalendar
            selectedDays={eventRange?.weekdays}
            onChange={setWeekdayRange}
          />
        )}
      </div>
    </div>
  );
}
