import { ClockIcon, CopyIcon, Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import DateRangeRow from "./date-range-row";
import WeekdayRow from "./weekday-row";

export type DashboardEventProps = {
  myEvent: boolean;
  code: string;
  title: string;
  type: "specific" | "weekday";
  startHour: number;
  endHour: number;
  startDate?: string;
  endDate?: string;
  startWeekday?: number;
  endWeekday?: number;
};

export default function DashboardEvent({
  myEvent = false,
  code,
  title,
  type,
  startHour,
  endHour,
  startDate,
  endDate,
  startWeekday,
  endWeekday,
}: DashboardEventProps) {
  const eventUrl =
    typeof window !== "undefined" ? `${window.location.origin}/${code}` : "";

  async function copyLink(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    await navigator.clipboard.writeText(eventUrl);
  }

  return (
    <Link href={`/${code}`}>
      <div className="flex w-full flex-col rounded-lg bg-white p-4 dark:bg-violet">
        <div className="rounded bg-white text-lg font-bold dark:bg-violet">
          {title}
        </div>
        {type === "specific" && (
          <DateRangeRow
            className="mt-1 mb-2"
            startDate={startDate!}
            endDate={endDate!}
          />
        )}
        {type === "weekday" && (
          <WeekdayRow
            className="mt-1 mb-2"
            startWeekday={startWeekday!}
            endWeekday={endWeekday!}
          />
        )}
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5" />
          {formatTimeRange(startHour, endHour)}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={copyLink}
            className="flex cursor-pointer items-center gap-0.5 rounded-full border border-violet px-2 py-1.5 dark:border-white"
          >
            <CopyIcon className="h-4 w-4" />
            <span className="ml-1 text-xs">Copy Link</span>
          </button>
          {myEvent && (
            <Link href={`/${code}/edit`}>
              <div className="w-fit rounded-full border border-violet p-1.5 dark:border-white">
                <Pencil1Icon className="h-4 w-4" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </Link>
  );
}

function formatHour(hour: number): string {
  if (hour == 0 || hour == 24) {
    return "12am";
  }
  const period = hour >= 12 ? "pm" : "am";
  const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${adjustedHour}${period}`;
}

function formatTimeRange(startHour: number, endHour: number): string {
  if (startHour === 0 && endHour === 24) {
    return "All day";
  }
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}
