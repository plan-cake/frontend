type DateRangeRowProps = {
  className?: string;
  startDate: string;
  endDate: string;
};

export default function DateRangeRow({
  className,
  startDate,
  endDate,
}: DateRangeRowProps) {
  return (
    <div
      className={`${className} w-fit rounded-full bg-blue/50 px-3 py-1 text-xs font-bold text-blue-500 dark:bg-red/50 dark:text-red-100`}
    >
      {formatDateRange(startDate, endDate)}
    </div>
  );
}

function formatDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", options);
}

function formatDateRange(startDate: string, endDate: string): string {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}
