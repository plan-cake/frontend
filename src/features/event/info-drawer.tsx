"use client";

import { useMemo } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { addDays } from "date-fns";
import { format } from "date-fns-tz/format";

import { EventRange, days } from "@/core/event/types";
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
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="cursor-pointer rounded-full md:hidden">
          <InfoCircledIcon width={20} height={20} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-gray-700/40" />
        <Dialog.Content
          className="animate-slideUp data-[state=closed]:animate-slideDown bg-panel ] fixed bottom-0 left-0 right-0 z-50 flex h-[500px] w-full flex-col rounded-t-3xl p-8 focus:outline-none"
          aria-label="Event Info"
        >
          <div
            aria-hidden
            className="sticky mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
          />
          <EventInfo eventRange={eventRange} timezone={timezone} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function EventInfo({ eventRange, timezone }: EventInfoProps) {
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
      <h1 className="font-semibold">Event Details</h1>

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
