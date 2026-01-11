import { MouseEvent, useMemo } from "react";

import { ClockIcon, Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

import DashboardCopyButton from "@/features/dashboard/components/copy-button";
import DateRangeRow from "@/features/dashboard/components/date-range-row";
import WeekdayRow from "@/features/dashboard/components/weekday-row";
import { formatTimeRange, getLocalDetails } from "@/lib/utils/date-time-format";

export type DashboardEventProps = {
  myEvent: boolean;
  code: string;
  title: string;
  type: "specific" | "weekday";
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
};

export default function DashboardEvent({
  myEvent = false,
  code,
  title,
  type,
  ...dateTimeProps
}: DashboardEventProps) {
  const router = useRouter();

  function navigateToEdit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); // prevent the link behind it triggering
    router.push(`/${code}/edit`);
  }

  // Memoized local start and end details
  const start = useMemo(
    () => getLocalDetails(dateTimeProps.startTime, dateTimeProps.startDate),
    [dateTimeProps.startTime, dateTimeProps.startDate],
  );
  const end = useMemo(
    () => getLocalDetails(dateTimeProps.endTime, dateTimeProps.endDate),
    [dateTimeProps.endTime, dateTimeProps.endDate],
  );

  return (
    <Link href={`/${code}`}>
      <div className="bg-background flex w-full flex-col rounded-lg p-4 transition-shadow hover:shadow-lg hover:shadow-black/25">
        <div className="bg-background rounded text-lg font-bold leading-tight">
          {title}
        </div>
        <div className="text-sm opacity-50">{code}</div>
        <div className="mb-2 mt-1">
          {type === "specific" && (
            <DateRangeRow startDate={start.date} endDate={end.date} />
          )}
          {type === "weekday" && (
            <WeekdayRow startWeekday={start.weekday} endWeekday={end.weekday} />
          )}
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5" />
          {formatTimeRange(start.time, end.time)}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <DashboardCopyButton code={code} />
          {myEvent && (
            <button className="cursor-pointer" onClick={navigateToEdit}>
              <div
                className={
                  "border-foreground hover:bg-foreground/25 w-fit rounded-full border p-1.5"
                }
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
