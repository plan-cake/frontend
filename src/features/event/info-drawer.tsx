"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";

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
          <span className="text-accent font-bold">
            {formatLabel(eventRange.timezone)}
          </span>
        </p>
      </div>

      <div className="space-y-4 overflow-y-auto">
        {eventRange.type === "specific" ? (
          <InfoRow label="Possible Dates">
            {formatDate(eventRange.dateRange.from, "EEE, MMMM d")} {" - "}
            {formatDate(eventRange.dateRange.to, "EEE, MMMM d")}
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
            : `${formatTime(eventRange.timeRange.from, "hh:mm a")} - ${formatTime(eventRange.timeRange.to, "hh:mm a")}`}
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
      <div className="text-accent">{children}</div>
    </div>
  );
}

// Helper functions to format date and time
function formatDate(date: string, fmt: string): string {
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  return format(parsedDate, fmt);
}

function formatTime(hour: number, fmt: string): string {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return format(date, fmt);
}
