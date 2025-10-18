import Link from "next/link";

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
      <div className="mb-2 flex w-full flex-col rounded rounded-lg bg-white p-4 dark:bg-violet">
        <div className="mb-2 w-full rounded bg-white dark:bg-violet">
          {title}
        </div>
      </div>
    </Link>
  );
}
