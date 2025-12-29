import * as Popover from "@radix-ui/react-popover";
import { fromZonedTime } from "date-fns-tz";

import { Calendar } from "@/features/event/editor/date-range/calendars/month";
import { DateRangeProps } from "@/features/event/editor/date-range/date-range-props";
import SpecificDateRangeDisplay from "@/features/event/editor/date-range/specific-date-display";
import { cn } from "@/lib/utils/classname";

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
      <Popover.Trigger className="hover:cursor-pointer">
        <SpecificDateRangeDisplay startDate={startDate} endDate={endDate} />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={10}
          className={cn(
            "bg-background z-50 rounded-2xl border border-gray-400 p-4 shadow-lg",
            "data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade",
          )}
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
