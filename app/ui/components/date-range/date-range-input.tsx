import { format } from "date-fns";

type DateRangeInputProps = {
  startDate: Date;
  endDate: Date;
};

export default function DateRangeInput({
  startDate,
  endDate,
}: DateRangeInputProps) {
  const displayFrom = startDate ? format(startDate, "EEE MMMM d, yyyy") : "";
  const displayTo = endDate ? format(endDate, "EEE MMMM d, yyyy") : "";
  return (
    <form className="flex w-full flex-col gap-y-2 md:flex-row md:gap-4">
      {/* Start Date */}
      <div className="flex w-fit items-center space-x-4">
        <label className="text-gray-400 md:hidden">FROM</label>
        <span
          className="bg-transparent text-blue focus:outline-none dark:text-red"
          aria-label="Start date"
        >
          {displayFrom}
        </span>
      </div>

      <span className="hidden w-fit text-gray-400 md:block">TO</span>

      {/* End Date */}
      <div className="flex w-fit items-center space-x-4">
        <label className="text-gray-400 md:hidden">UNTIL</label>
        <span
          className="bg-transparent text-blue focus:outline-none md:text-end dark:text-red"
          aria-label="End date"
        >
          {displayTo}
        </span>
      </div>
    </form>
  );
}
