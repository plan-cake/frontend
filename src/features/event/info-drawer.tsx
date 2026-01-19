"use client";

import { useMemo, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { InfoCircledIcon, Cross1Icon } from "@radix-ui/react-icons";
import { addDays } from "date-fns";
import { format } from "date-fns-tz/format";

import { EventRange, days } from "@/core/event/types";
import ActionButton from "@/features/button/components/action";
import WeekdayRow from "@/features/dashboard/components/weekday-row";
import {
  formatDateRange,
  formatTimeRange,
  getTimezoneDetails,
} from "@/lib/utils/date-time-format";

type EventInfoProps = {
  eventRange: EventRange;
  timezone: string;
};

export default function EventInfoDrawer({
  eventRange,
  timezone,
}: EventInfoProps) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    return true;
  };

  const handleOpen = () => {
    setOpen(true);
    return true;
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="md:hidden">
        <ActionButton
          buttonStyle="frosted glass"
          icon={<InfoCircledIcon />}
          onClick={handleOpen}
        />
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-gray-700/40" />
        <Dialog.Content
          className="animate-slideUp data-[state=closed]:animate-slideDown fixed bottom-0 left-0 right-0 z-50 flex h-[500px] w-full flex-col focus:outline-none"
          aria-label="Event Info"
        >
          <div className="rounded-t-4xl bg-background flex flex-1 flex-col overflow-y-auto p-8 shadow-lg">
            <div
              onPointerDown={handleClose}
              className="bg-background sticky top-0 z-10 flex items-center gap-4 pb-8"
            >
              <ActionButton
                buttonStyle="frosted glass"
                icon={<Cross1Icon />}
                label="Close Drawer"
                shrinkOnMobile
                onClick={handleClose}
              />

              <Dialog.Title className="mb-0 flex flex-row items-center justify-between text-lg font-semibold">
                Event Details
              </Dialog.Title>

              <Dialog.Description className="sr-only">
                View details about the event
              </Dialog.Description>
            </div>

            <EventInfo eventRange={eventRange} timezone={timezone} noTitle />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function EventInfo({
  eventRange,
  timezone,
  noTitle,
}: EventInfoProps & { noTitle?: boolean }) {
  const startTime = eventRange.timeRange.from;
  const endTime = eventRange.timeRange.to;

  let startDate, endDate;
  if (eventRange.type === "specific") {
    startDate = eventRange.dateRange.from;
    endDate = eventRange.dateRange.to;
  } else {
    const activeDays = days
      .map((day, i) => (eventRange.weekdays[day] === 1 ? i : -1))
      .filter((i) => i !== -1);

    if (activeDays.length > 0) {
      const referenceStart = new Date("2012-01-01T00:00:00");
      startDate = format(addDays(referenceStart, activeDays[0]), "yyyy-MM-dd");
      endDate = format(
        addDays(referenceStart, activeDays[activeDays.length - 1]),
        "yyyy-MM-dd",
      );
    }
  }

  const start = useMemo(
    () =>
      getTimezoneDetails({
        time: startTime,
        date: startDate!,
        fromTZ: eventRange.timezone,
        toTZ: timezone,
      }),
    [startTime, startDate, eventRange.timezone, timezone],
  );

  const end = useMemo(
    () =>
      getTimezoneDetails({
        time: endTime,
        date: endDate!,
        fromTZ: eventRange.timezone,
        toTZ: timezone,
      }),
    [endTime, endDate, eventRange.timezone, timezone],
  );

  return (
    <section className="space-y-2 overflow-y-auto">
      {!noTitle && <h1 className="font-semibold">Event Details</h1>}

      {eventRange.type === "specific" ? (
        <InfoRow label="Possible Dates">
          {formatDateRange(start.date, end.date)}
        </InfoRow>
      ) : (
        <InfoRow label="Days of the Week">
          <WeekdayRow startWeekday={start.weekday} endWeekday={end.weekday} />
        </InfoRow>
      )}

      <InfoRow label="Possible Times">
        {formatTimeRange(start.time, end.time)}
      </InfoRow>

      {eventRange.duration > 0 && (
        <InfoRow label="Intended Duration">
          {eventRange.duration} minutes
        </InfoRow>
      )}
    </section>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-gray-400">{label}</div>
      <div className="text-accent">{children}</div>
    </div>
  );
}
