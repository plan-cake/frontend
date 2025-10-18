import { cn } from "@/app/_lib/classname";
import { ClockIcon, Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import DashboardCopyButton from "./dashboard-copy-button";
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
  return (
    <Link href={`/${code}`}>
      <div className="flex w-full flex-col rounded-lg bg-white p-4 transition-shadow hover:shadow-lg hover:shadow-black/25 dark:bg-violet">
        <div className="rounded bg-white text-lg font-bold dark:bg-violet">
          {title}
        </div>
        <div className="text-sm opacity-50">{code}</div>
        {type === "specific" && (
          <DateRangeRow
            className="my-2"
            startDate={startDate!}
            endDate={endDate!}
          />
        )}
        {type === "weekday" && (
          <WeekdayRow
            className="my-2"
            startWeekday={startWeekday!}
            endWeekday={endWeekday!}
          />
        )}
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5" />
          {formatTimeRange(startHour, endHour)}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <DashboardCopyButton code={code} />
          {myEvent && (
            <Link href={`/${code}/edit`}>
              <div
                className={cn(
                  "w-fit rounded-full border border-violet p-1.5 dark:border-white",
                  "transition hover:bg-violet/25 dark:hover:bg-white/25",
                )}
              >
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
