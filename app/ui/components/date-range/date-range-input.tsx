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
    <form className="flex flex-col gap-y-2 md:flex-row">
      <div className="flex space-x-4">
        <label className="text-gray-400 md:hidden">FROM</label>
        <input
          value={displayFrom}
          className="text-blue focus:outline-none dark:text-red"
          aria-label="Start date"
          readOnly
        />
      </div>

      <span className="mr-2 hidden text-gray-400 md:block">TO</span>

      <div className="flex space-x-4">
        <label className="text-gray-400 md:hidden">UNTIL</label>
        <input
          value={displayTo}
          className="text-blue focus:outline-none md:text-end dark:text-red"
          aria-label="End date"
          readOnly
        />
      </div>
    </form>
  );
}
