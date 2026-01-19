import { useMemo } from "react";

export default function TimeColumn({
  timeColWidth,
  numQuarterHours,
  startHour,
}: {
  timeColWidth: number;
  numQuarterHours: number;
  startHour: number;
}) {
  // generate hour labels for the time column
  const hoursLabel = useMemo(() => {
    return Array.from({ length: numQuarterHours }, (_, i) => {
      const hour24 = startHour + Math.floor(i / 4);
      const hour12 = hour24 % 12 || 12;
      const period = hour24 < 12 ? "AM" : "PM";
      return `${hour12} ${period}`;
    });
  }, [startHour, numQuarterHours]);

  return (
    <div
      className="pointer-events-none"
      style={{
        width: `${timeColWidth}px`,
        display: "grid",
        gridTemplateRows: `repeat(${numQuarterHours}, minmax(20px, 1fr))`,
      }}
    >
      {Array.from({ length: numQuarterHours }).map((_, i) =>
        i % 4 === 0 ? (
          <div
            key={`label-${i}`}
            className="relative flex items-start justify-end pr-2 text-right text-xs"
          >
            <span className="absolute -top-2">{hoursLabel[i]}</span>
          </div>
        ) : (
          <div key={`empty-${i}`} />
        ),
      )}
    </div>
  );
}
