import { Drawer } from "vaul";
import { Calendar } from "./month-calendar";
import { format } from "date-fns";

type Props = {
  specificRange: { from: Date | null; to: Date | null };
  onChangeSpecific: (range: { from: Date | null; to: Date | null }) => void;
};

export default function DateRangeDrawer({
  specificRange,
  onChangeSpecific,
}: Props) {
  const displayFrom = specificRange.from
    ? format(specificRange.from, "EEE, MMM d")
    : "";
  const displayTo = specificRange.to
    ? format(specificRange.to, "EEE, MMM d")
    : "";

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <form className="ma2 w-fit rounded-full">
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
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          className="fixed right-0 bottom-0 left-0 z-50 flex h-[500px] w-full flex-col"
          aria-label="Date range picker"
        >
          <div className="flex-1 overflow-y-auto rounded-md rounded-t-[10px] bg-white p-4 shadow-lg dark:bg-dblue">
            <div
              aria-hidden
              className="sticky mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
            />
            <Drawer.Title className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Select a Date Range
            </Drawer.Title>
            <Calendar
              selectedRange={{
                from: specificRange.from || undefined,
                to: specificRange.to || undefined,
              }}
              onRangeSelect={(from, to) => onChangeSpecific({ from, to })}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

const DateRange = ({ specificRange, onChangeSpecific }: Props) => {
  const displayFrom = specificRange.from
    ? format(specificRange.from, "EEE, MMM d")
    : "";
  const displayTo = specificRange.to
    ? format(specificRange.to, "EEE, MMM d")
    : "";
  return (
    <form className="ma2 w-fit rounded-full">
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
};
