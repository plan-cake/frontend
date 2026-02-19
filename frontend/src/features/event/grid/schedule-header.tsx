import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";

import {
  TIME_LABEL_WIDTH,
  SIDE_WIDTH,
} from "@/features/event/grid/lib/constants";
import { cn } from "@/lib/utils/classname";

interface ScheduleHeaderProps {
  preview?: boolean;
  visibleDays: { dayKey: string; dayDisplay: string }[];
  currentPage: number;
  totalPages: number;
  isWeekdayEvent?: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  direction?: number;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "50%" : "-50%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "50%" : "-50%",
    opacity: 0,
  }),
};

export default function ScheduleHeader({
  preview = false,
  visibleDays,
  currentPage,
  totalPages,
  isWeekdayEvent = false,
  onPrevPage,
  onNextPage,
  direction = 0,
}: ScheduleHeaderProps) {
  return (
    <div
      className={cn(
        preview ? "bg-panel top-0 pr-4" : "top-25 bg-background",
        "sticky z-10 col-span-2 grid h-[50px] w-full items-center justify-center",
      )}
      style={{
        gridTemplateColumns: `${TIME_LABEL_WIDTH}px 1fr ${currentPage < totalPages - 1 ? SIDE_WIDTH : 10}px`,
      }}
    >
      {currentPage > 0 ? (
        <button
          onClick={onPrevPage}
          aria-label="Previous Page"
          className={cn(
            "ml-3 flex h-9 w-9 cursor-pointer items-center justify-center",
            "bg-accent/15 hover:bg-accent/25 active:bg-accent/40 rounded-full text-xl",
          )}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
      ) : (
        <div style={{ width: `${SIDE_WIDTH}px` }} />
      )}

      {/* This container takes up the '1fr' space */}
      <div className="relative grid h-full select-none overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: "easeInOut" }}
            className="absolute inset-0 grid h-full w-full items-center"
            style={{
              gridTemplateColumns: `repeat(${visibleDays.length}, 1fr)`,
            }}
          >
            {visibleDays.map(({ dayDisplay }, i) => {
              const [weekday, month, day] = dayDisplay.split(" ");

              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center text-sm font-medium leading-tight"
                >
                  <div>{isWeekdayEvent ? weekday.toUpperCase() : weekday}</div>
                  {!isWeekdayEvent && (
                    <div>
                      {month} {day.replace(/^0+/, "")}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {currentPage < totalPages - 1 ? (
        <button
          onClick={onNextPage}
          aria-label="Next Page"
          className={cn(
            "flex h-9 w-9 cursor-pointer items-center justify-center",
            "bg-accent/15 hover:bg-accent/25 active:bg-accent/40 rounded-full text-xl",
          )}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      ) : (
        <div style={{ width: `${SIDE_WIDTH}px` }} />
      )}
    </div>
  );
}
