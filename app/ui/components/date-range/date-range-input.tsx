import { format } from "date-fns";

type DateRangeInputProps = {
  specificRange: { from: Date | null; to: Date | null } | undefined;
  onChangeSpecific?: (key: "from" | "to", value: Date) => void;
};

export default function DateRangeInput({
  specificRange,
  onChangeSpecific,
}: DateRangeInputProps) {
  const displayFrom = specificRange?.from
    ? format(specificRange.from, "EEE, MMM d")
    : "";
  const displayTo = specificRange?.to
    ? format(specificRange.to, "EEE, MMM d")
    : "";
  return (
    <form className="ma2 flex w-fit flex-row rounded-full">
      <input
        size={10}
        value={displayFrom}
        onChange={(e) => onChangeSpecific?.("from", new Date(e.target.value))}
        className="rounded-l-full border-1 border-violet-500 px-4 py-1 text-center hover:border-lion focus:outline-none dark:border-gray-400 dark:hover:border-bone"
        aria-label="Start date"
      />
      <input
        size={10}
        value={displayTo}
        onChange={(e) => onChangeSpecific?.("to", new Date(e.target.value))}
        className="rounded-r-full border-1 border-violet-500 px-4 py-1 text-center hover:border-lion focus:outline-none dark:border-gray-400 dark:hover:border-bone"
        aria-label="End date"
      />
    </form>
  );
}
