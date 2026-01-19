import { TimeBlockProps } from "@/features/event/grid/timeblocks/props";
import { cn } from "@/lib/utils/classname";

export default function BaseTimeBlock({
  numQuarterHours,
  visibleDaysCount,
  children,
}: TimeBlockProps) {
  return (
    <div className="relative isolate">
      <div
        className={cn(
          "grid w-full gap-x-[1px] bg-gray-400",
          "border border-gray-400",
        )}
        style={{
          gridTemplateColumns: `repeat(${visibleDaysCount}, 1fr)`,
          gridTemplateRows: `repeat(${numQuarterHours}, minmax(20px, 1fr))`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
