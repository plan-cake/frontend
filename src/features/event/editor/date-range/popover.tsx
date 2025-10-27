import * as Popover from "@radix-ui/react-popover";
import { fromZonedTime } from "date-fns-tz";

import { DateRangeProps } from "@/features/event/editor/date-range/date-range-props";
import DateRangeInput from "@/features/event/editor/date-range/input";
import { Calendar } from "@/features/event/editor/month-calendar";

export default function DateRangePopover({
  earliestDate,
  eventRange,
  setDateRange = () => {},
}: DateRangeProps) {
  // If the event range is not specific, return null
  if (eventRange.type !== "specific") {
    return null;
  }

  const startDate = fromZonedTime(
    eventRange.dateRange.from,
    eventRange.timezone,
  );
  const endDate = fromZonedTime(eventRange.dateRange.to, eventRange.timezone);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <div>
          <DateRangeInput startDate={startDate} endDate={endDate} />
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          className="data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade z-50 rounded-md border border-gray-300 bg-white p-4 shadow-lg dark:border-gray-400 dark:bg-violet"
          aria-label="Date range picker"
        >
          <Calendar
            earliestDate={earliestDate}
            className="w-fit"
            selectedRange={{
              from: startDate || undefined,
              to: endDate || undefined,
            }}
            setDateRange={setDateRange}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
