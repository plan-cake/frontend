import { format } from "date-fns";

type DateRangeInputProps = {
  specificRange: { from: Date | null; to: Date | null };
  onChangeSpecific: (range: { from: Date | null; to: Date | null }) => void;
};

export default function DateRangeInput({
  specificRange,
  onChangeSpecific,
}: DateRangeInputProps) {
  const displayFrom = specificRange.from
    ? format(specificRange.from, "EEE, MMM d")
    : "";
  const displayTo = specificRange.to
    ? format(specificRange.to, "EEE, MMM d")
    : "";
  return (
    <form className="ma2 flex w-fit flex-row rounded-full">
      <input
        size={10}
        value={displayFrom}
        onChange={(e) =>
          onChangeSpecific({
            ...specificRange,
            from: new Date(e.target.value),
          })
        }
        className="rounded-l-full border-1 border-dblue-500 px-4 py-1 text-center hover:border-red focus:outline-none dark:border-gray-400"
        aria-label="Start date"
      />
      <input
        size={10}
        value={displayTo}
        onChange={(e) =>
          onChangeSpecific({
            ...specificRange,
            to: new Date(e.target.value),
          })
        }
        className="rounded-r-full border-1 border-dblue-500 px-4 py-1 text-center hover:border-red focus:outline-none dark:border-gray-400"
        aria-label="End date"
      />
    </form>
  );
}
