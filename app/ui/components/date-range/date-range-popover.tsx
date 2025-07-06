"use client";

import * as Popover from "@radix-ui/react-popover";
import { Calendar } from "../month-calendar";
import { DateRangeProps } from "@/app/_types/date-range-types";
import DateRangeInput from "./date-range-input";

export default function DateRangePopover({
  specificRange,
  onChangeSpecific,
}: DateRangeProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <div>
          <DateRangeInput
            specificRange={specificRange}
            onChangeSpecific={onChangeSpecific}
          />
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          className="z-50 rounded-md border border-gray-300 bg-white p-4 shadow-lg data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade dark:border-gray-400 dark:bg-violet"
          aria-label="Date range picker"
        >
          <Calendar
            className="w-fit"
            selectedRange={{
              from: specificRange?.from || undefined,
              to: specificRange?.to || undefined,
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
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
