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
      className={`w-fit rounded-full bg-blue/50 px-3 py-1 text-xs font-bold text-blue-500 dark:bg-red/50 dark:text-red-100`}
    >
      {formatDates(startDate, endDate)}
    </div>
  );
}

function formatDates(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start.getUTCMonth() === end.getUTCMonth()) {
    if (start.getUTCDate() === end.getUTCDate()) {
      return `${start.toLocaleString("en-US", { month: "long" })} ${start.getUTCDate()}`;
    } else {
      return `${start.toLocaleString("en-US", { month: "long" })} ${start.getUTCDate()} - ${end.getUTCDate()}`;
    }
  } else {
    return `${start.toLocaleString("en-US", { month: "long" })} ${start.getUTCDate()} - ${end.toLocaleString("en-US", { month: "long" })} ${end.getUTCDate()}`;
  }
}
