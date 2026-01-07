"use client";

import { useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { ExclamationTriangleIcon, Cross1Icon } from "@radix-ui/react-icons";

import { useEventContext } from "@/core/event/context";
import ActionButton from "@/features/button/components/action";
import { Calendar } from "@/features/event/editor/date-range/calendars/month";
import { SpecificDateRangeDisplayProps } from "@/features/event/editor/date-range/date-range-props";
import SpecificDateRangeDisplay from "@/features/event/editor/date-range/specific-date-display";

export default function DateRangeDrawer({
  earliestDate,
  startDate,
  endDate,
}: SpecificDateRangeDisplayProps) {
  const { errors, setDateRange } = useEventContext();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    return true;
  };

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
                {errors.dateRange ? (
                  <span className="text-error flex items-center gap-2 text-sm">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    {errors.dateRange}
                  </span>
                ) : (
                  <span className="text-accent text-sm font-normal">
                    Choose a start and end date
                  </span>
                )}
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
              dateRangeError={errors.dateRange}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
