import { cn } from "@/app/_lib/classname";

type WeekdayRowProps = {
  className?: string;
  startWeekday: number;
  endWeekday: number;
};

export default function WeekdayRow({
  className,
  startWeekday,
  endWeekday,
}: WeekdayRowProps) {
  return (
    <div className={`flex w-full gap-1 ${className}`}>
      {["S", "M", "T", "W", "T", "F", "S"].map((initial, index) => (
        <WeekdayRowIcon
          key={index}
          label={initial}
          index={index}
          start={startWeekday}
          end={endWeekday}
        />
      ))}
    </div>
  );
}

function WeekdayRowIcon({
  label,
  index,
  start,
  end,
}: {
  label: string;
  index: number;
  start: number;
  end: number;
}) {
  const isActive = index >= start && index <= end;
  return (
    <div
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
        isActive && "bg-blue/50 dark:bg-red/50",
      )}
    >
      {label}
    </div>
  );
}
