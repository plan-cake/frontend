"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import { EventRange } from "@/core/event/types";

function formatLabel(tz: string): string {
  try {
    const now = new Date();
    const offset =
      new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "shortOffset",
      })
        .formatToParts(now)
        .find((p) => p.type === "timeZoneName")?.value || "";

    // Try to normalize to GMT+/-HH:MM
    const match = offset.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);
    const hours = match?.[1] ?? "0";
    const minutes = match?.[2] ?? "00";
    const fullOffset = `GMT${hours}:${minutes}`;

    const city = tz.split("/").slice(-1)[0].replaceAll("_", " ");
    return `${city} (${fullOffset})`;
  } catch {
    return tz;
  }
}

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
        <Dialog.Overlay className="fixed inset-0 z-40 bg-gray-700/40" />
        <Dialog.Content
          className="animate-slideUp data-[state=closed]:animate-slideDown fixed bottom-0 left-0 right-0 z-50 flex h-[500px] w-full flex-col rounded-t-3xl bg-white p-8 focus:outline-none dark:bg-[#343249]"
          aria-label="Event Info"
        >
          <div
            aria-hidden
            className="sticky mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
          />
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
          <span className="font-bold">original event&apos;s timezone</span>{" "}
          which is{" "}
          <span className="text-blue dark:text-red font-bold">
            {formatLabel(eventRange.timezone)}
          </span>
        </p>
      </div>

      <div className="space-y-4 overflow-y-auto">
        {eventRange.type === "specific" ? (
          <InfoRow label="Possible Dates">
            {prettyDate(new Date(eventRange.dateRange.from!), "date")} –{" "}
            {prettyDate(new Date(eventRange.dateRange.to!), "date")}
          </InfoRow>
        ) : (
          <InfoRow label="Days of the Week">
            {Object.entries(eventRange.weekdays)
              .filter(([, val]) => val === 1)
              .map(([day]) => day)
              .join(", ")}
          </InfoRow>
        )}

        <InfoRow label="Possible Times">
          {eventRange.timeRange.from === 0 && eventRange.timeRange.to === 24
            ? "Anytime"
            : `${prettyDate(
                new Date(new Date().setHours(eventRange.timeRange.from, 0)),
                "time",
              )} - ${prettyDate(
                new Date(new Date().setHours(eventRange.timeRange.to, 0)),
                "time",
              )}`}
        </InfoRow>

        {eventRange.duration > 0 && (
          <InfoRow label="Intended Duration">
            {eventRange.duration} minutes
          </InfoRow>
        )}
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
