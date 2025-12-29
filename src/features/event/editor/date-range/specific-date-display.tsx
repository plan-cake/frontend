import { format } from "date-fns";

type SpecificDateRangeDisplayProps = {
  startDate: Date;
  endDate: Date;
};

export default function SpecificDateRangeDisplay({
  startDate,
  endDate,
}: SpecificDateRangeDisplayProps) {
  const displayFrom = startDate ? format(startDate, "EEE MMMM d, yyyy") : "";
  const displayTo = endDate ? format(endDate, "EEE MMMM d, yyyy") : "";
  return (
    <form className="flex w-full flex-col gap-y-2 md:flex-row md:gap-4">
      {/* Start Date */}
      <div className="flex w-fit items-center space-x-4">
        <label htmlFor="start-date" className="text-gray-400 md:hidden">
          FROM
        </label>
        <span
          id="start-date"
          className="bg-loading text-accent hover:md:bg-loading rounded-full px-3 py-1 focus:outline-none md:bg-transparent"
          aria-label="Start date"
        >
          {displayFrom}
        </span>
      </div>

      <span className="hidden w-fit py-1 text-gray-400 md:block">TO</span>

      {/* End Date */}
      <div className="flex w-fit items-center space-x-4">
        <label htmlFor="end-date" className="text-gray-400 md:hidden">
          UNTIL
        </label>
        <span
          id="end-date"
          className="text-accent bg-loading hover:md:bg-loading rounded-full px-3 py-1 focus:outline-none md:bg-transparent md:text-end"
          aria-label="End date"
        >
          {displayTo}
        </span>
      </div>
    </form>
  );
}
