"use client";

import { EventRange } from "@/app/_lib/schedule/types";
import { formatLabel } from "@/app/_lib/timezone-file-generator";

import * as Dialog from "@radix-ui/react-dialog";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export default function EventInfoDrawer({
  eventRange,
}: {
  eventRange: EventRange;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="rounded-full hover:bg-gray-100 focus:outline-none md:hidden dark:border-gray-400 dark:hover:bg-gray-700">
          <InfoCircledIcon width={20} height={20} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Content
          className="fixed right-0 bottom-0 left-0 z-50 flex h-[500px] w-full animate-slideUp flex-col rounded-t-3xl bg-white p-8 focus:outline-none data-[state=closed]:animate-slideDown dark:bg-[#343249]"
          aria-label="Event Info"
        >
          <EventInfo eventRange={eventRange} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function EventInfo({ eventRange }: { eventRange: EventRange }) {
  return (
    <section>
      <div className="sticky top-0 mb-4 items-center justify-between">
        <h1 className="font-semibold">Event Details</h1>
        <p className="text-xs">
          Please note that these details are presented in respect to the{" "}
          <span className="font-bold">original event's timezone</span> which is{" "}
          <span className="font-bold text-blue dark:text-red">
            {formatLabel(eventRange.timezone)}
          </span>
        </p>
      </div>

      <div className="space-y-4 overflow-y-auto">
        {eventRange.type === "specific" ? (
          <InfoRow label="Possible Dates">
            {prettyDate(eventRange.dateRange.from!, "date")} –{" "}
            {prettyDate(eventRange.dateRange.to!, "date")}
          </InfoRow>
        ) : (
          <InfoRow label="Days of the Week">
            {Object.entries(eventRange.weekdays)
              .filter(([_, val]) => val === 1)
              .map(([day]) => day)
              .join(", ")}
          </InfoRow>
        )}

        <InfoRow label="Possible Times">
          {prettyDate(eventRange.timeRange.from!, "time")} –{" "}
          {prettyDate(eventRange.timeRange.to!, "time")}
        </InfoRow>

        <InfoRow label="Intended Duration">
          {eventRange.duration} minutes
        </InfoRow>
      </div>
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
    <div>
      <div className="text-sm font-medium text-gray-400">{label}</div>
      <div className="text-blue dark:text-red">{children}</div>
    </div>
  );
}

function prettyDate(date: Date, type?: "date" | "time") {
  return new Intl.DateTimeFormat("en-US", {
    weekday: type === "date" ? "short" : undefined,
    month: type === "date" ? "long" : undefined,
    day: type === "date" ? "numeric" : undefined,
    year: undefined,
    hour: type === "time" ? "numeric" : undefined,
    minute: type === "time" ? "numeric" : undefined,
    hour12: true,
  }).format(date);
}
