interface TimeBlockProps {
  numQuarterHours: number;
  visibleDaysCount: number;
  children: React.ReactNode;
}

export default function BaseTimeBlock({
  numQuarterHours,
  visibleDaysCount,
  children,
}: TimeBlockProps) {
  return (
    <div
      className="grid w-full gap-x-[1px] border border-gray-400 bg-gray-400"
      style={{
        gridTemplateColumns: `repeat(${visibleDaysCount}, 1fr)`,
        gridTemplateRows: `repeat(${numQuarterHours}, minmax(20px, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}
