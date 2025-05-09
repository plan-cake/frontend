"use client";

import * as Popover from "@radix-ui/react-popover";
import { Calendar } from "../month-calendar";
import { format } from "date-fns";
import { DateRangeProps } from "@/app/_types/date-range-types";

export default function DateRangePopover({
  specificRange,
  onChangeSpecific,
}: DateRangeProps) {
  const displayFrom = specificRange.from
    ? format(specificRange.from, "EEE, MMM d")
    : "";
  const displayTo = specificRange.to
    ? format(specificRange.to, "EEE, MMM d")
    : "";

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <form className="ma2 w-fit rounded-full">
          <input
            size={10}
            value={displayFrom}
            onChange={(e) =>
              onChangeSpecific({
                ...specificRange,
                from: new Date(e.target.value),
              })
            }
            className="rounded-l-full border-1 border-dblue-500 px-4 py-1 text-center hover:border-red focus:outline-none dark:border-gray-400"
            aria-label="Start date"
          />
          <input
            size={10}
            value={displayTo}
            onChange={(e) =>
              onChangeSpecific({
                ...specificRange,
                to: new Date(e.target.value),
              })
            }
            className="rounded-r-full border-1 border-dblue-500 px-4 py-1 text-center hover:border-red focus:outline-none dark:border-gray-400"
            aria-label="End date"
          />
        </form>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          className="z-50 rounded-md border border-gray-300 bg-white p-4 shadow-lg data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade dark:border-gray-400 dark:bg-dblue"
          aria-label="Date range picker"
        >
          <Calendar
            className="w-fit"
            selectedRange={{
              from: specificRange.from || undefined,
              to: specificRange.to || undefined,
            }}
            onRangeSelect={(from, to) => onChangeSpecific({ from, to })}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
