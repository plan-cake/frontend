import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import * as Switch from "@radix-ui/react-switch";
import { fromZonedTime } from "date-fns-tz";

import { useEventContext } from "@/core/event/context";
import { SpecificDateRange } from "@/core/event/types";
import WeekdayCalendar from "@/features/event/editor/date-range/calendars/weekday";
import { DateRangeProps } from "@/features/event/editor/date-range/date-range-props";
import DateRangeDrawer from "@/features/event/editor/date-range/drawer";
import EventTypeSelect from "@/features/event/editor/date-range/event-type-select";
import DateRangePopover from "@/features/event/editor/date-range/popover";
import FormSelectorField from "@/features/selector/components/selector-field";
import useCheckMobile from "@/lib/hooks/use-check-mobile";
import { cn } from "@/lib/utils/classname";

export default function DateRangeSelection({
  editing = false,
}: DateRangeProps) {
  const { state, setEventType, setWeekdayRange, errors } = useEventContext();
  const { eventRange } = state;

  const rangeType = eventRange?.type ?? "specific";

  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-2",
        "md:grid-cols-[200px_1fr] md:gap-4",
      )}
    >
      <div className="hidden flex-col md:flex">
        <label htmlFor="event-type-select">Type</label>
        <EventTypeSelect id="event-type-select" disabled={editing} />
      </div>
      <div className="flex w-fit flex-col justify-center">
        <label
          className={`flex items-center gap-2 ${errors.dateRange ? "text-error" : ""}`}
        >
          Possible Dates
          {errors.dateRange && (
            <ExclamationTriangleIcon className="text-error h-4 w-4" />
          )}
        </label>

        <FormSelectorField
          label="Choose Days of the Week"
          htmlFor="event-type"
          classname="md:hidden mb-2"
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
          <SpecificDateRangeDisplay eventRange={eventRange} />
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

function SpecificDateRangeDisplay({
  eventRange,
}: {
  eventRange: SpecificDateRange;
}) {
  const isMobile = useCheckMobile();

  const earliestDate = new Date(); // earliest selectable date is the current date
  const startDate = fromZonedTime(
    eventRange.dateRange.from,
    eventRange.timezone,
  );
  const endDate = fromZonedTime(eventRange.dateRange.to, eventRange.timezone);

  if (isMobile) {
    return (
      <DateRangeDrawer
        earliestDate={earliestDate}
        startDate={startDate}
        endDate={endDate}
      />
    );
  } else {
    return (
      <DateRangePopover
        earliestDate={earliestDate}
        startDate={startDate}
        endDate={endDate}
      />
    );
  }
}
