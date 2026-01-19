import { TimeBlockProps } from "@/features/event/grid/timeblocks/props";

export default function BaseTimeBlock({
  ref,
  numQuarterHours,
  visibleDaysCount,
  children,
}: TimeBlockProps) {
  return (
    <div className="relative isolate" ref={ref}>
      <div
        className="bg-foreground border-foreground/75 grid w-full gap-x-[1px] border"
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
