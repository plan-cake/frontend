import { ClockIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import WeekdayRow from "./weekday-row";

export type DashboardEventProps = {
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
      <div className="flex w-full flex-col rounded-lg bg-white p-4 dark:bg-violet">
        <div className="rounded bg-white text-lg font-bold dark:bg-violet">
          {title}
        </div>
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
