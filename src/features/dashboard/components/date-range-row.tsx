import { formatDateRange } from "@/lib/utils/date-time-format";

type DateRangeRowProps = {
  startDate: string;
  endDate: string;
};

export default function DateRangeRow({
  startDate,
  endDate,
}: DateRangeRowProps) {
  return (
    <div
      className={`bg-accent/50 text-accent-text w-fit rounded-full px-3 py-1 text-xs font-bold`}
    >
      {formatDateRange(startDate, endDate)}
    </div>
  );
}
