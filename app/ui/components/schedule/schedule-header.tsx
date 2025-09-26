import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface Day {
  dayKey: string;
  dayLabel: string;
}

interface ScheduleHeaderProps {
  visibleDays: Day[];
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export default function ScheduleHeader({
  visibleDays,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: ScheduleHeaderProps) {
  return (
    <div
      className="sticky top-0 z-10 col-span-2 grid h-[50px] w-full items-center bg-white dark:bg-violet"
      style={{
        gridTemplateColumns: `auto repeat(${visibleDays.length}, 1fr) auto`,
      }}
    >
      {currentPage > 0 ? (
        <button
          onClick={onPrevPage}
          className="flex h-[50px] w-[50px] items-center justify-center text-xl"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
      ) : (
        <div style={{ width: "50px" }} />
      )}

      {visibleDays.map((day, i) => {
        const [weekday, month, date] = day.dayLabel.split(" ");
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-center text-sm leading-tight font-medium"
          >
            <div>{weekday}</div>
            <div>
              {month} {date}
            </div>
          </div>
        );
      })}

      {currentPage < totalPages - 1 ? (
        <button onClick={onNextPage} className="h-[50px] w-[20px] text-xl">
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      ) : (
        <div style={{ width: "20px" }} />
      )}
    </div>
  );
}
