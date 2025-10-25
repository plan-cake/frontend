import { MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClockIcon, Pencil1Icon } from "@radix-ui/react-icons";

import { cn } from "@/src/lib/utils/classname";

import DashboardCopyButton from "@/src/features/dashboard/components/copy-button";
import DateRangeRow from "@/src/features/dashboard/components/date-range-row";
import WeekdayRow from "@/src/features/dashboard/components/weekday-row";

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
  const router = useRouter();

  function navigateToEdit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); // prevent the link behind it triggering
    router.push(`/${code}/edit`);
  }

  return (
    <Link href={`/${code}`}>
      <div className="flex w-full flex-col rounded-lg bg-white p-4 transition-shadow hover:shadow-lg hover:shadow-black/25 dark:bg-violet">
        <div className="rounded bg-white text-lg font-bold leading-tight dark:bg-violet">
          {title}
        </div>
        <div className="text-sm opacity-50">{code}</div>
        <div className="mb-2 mt-1">
          {type === "specific" && (
            <DateRangeRow startDate={startDate!} endDate={endDate!} />
          )}
          {type === "weekday" && (
            <WeekdayRow startWeekday={startWeekday!} endWeekday={endWeekday!} />
          )}
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5" />
          {formatTimeRange(startHour, endHour)}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <DashboardCopyButton code={code} />
          {myEvent && (
            <button className="cursor-pointer" onClick={navigateToEdit}>
              <div
                className={cn(
                  "w-fit rounded-full border border-violet p-1.5 dark:border-white",
                  "hover:bg-violet/25 transition dark:hover:bg-white/25",
                )}
              >
                <Pencil1Icon className="h-4 w-4" />
              </div>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

function formatHour(hour: number): string {
  if (hour === 0 || hour === 24) {
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
