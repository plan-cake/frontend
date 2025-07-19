"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { EventRange } from "@/app/_types/schedule-types";

import { InfoCircledIcon } from "@radix-ui/react-icons";

export default function EventInfoDrawer({
  eventRange,
}: {
  eventRange: EventRange;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="rounded-full hover:bg-gray-100 md:hidden dark:border-gray-400 dark:hover:bg-gray-700">
          <InfoCircledIcon width={20} height={20} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Content
          className="fixed right-0 bottom-0 left-0 z-50 flex h-[500px] w-full animate-slideUp flex-col rounded-t-3xl bg-white p-8 data-[state=closed]:animate-slideDown dark:bg-[#343249]"
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
      <h2 className="mb-2 text-lg font-semibold">Event Details</h2>
      <div>
        <span className="font-medium text-blue dark:text-red">
          Possible Dates:
        </span>
        {eventRange.type === "specific" ? (
          <span>
            {eventRange.dateRange.from?.toLocaleDateString()} –{" "}
            {eventRange.dateRange.to?.toLocaleDateString()}
          </span>
        ) : (
          <span>
            {Object.entries(eventRange.weekdays)
              .filter(([_, isSelected]) => isSelected)
              .map(([day]) => day)
              .join(", ")}
          </span>
        )}
      </div>
      <div>
        <span className="font-medium text-blue dark:text-red">
          Possible Times:
        </span>
        <div>
          {eventRange.timeRange.from?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          –{" "}
          {eventRange.timeRange.to?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      <div>
        <span className="font-medium text-blue dark:text-red">
          Original Event Timezone:
        </span>
        <div>{eventRange.timezone}</div>
      </div>
      <div>
        <span className="font-medium text-blue dark:text-red">
          Intended Duration:
        </span>
        <div>{eventRange.duration} minutes</div>
      </div>
    </section>
  );
}
