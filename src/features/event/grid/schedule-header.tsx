import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";

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
        preview ? "bg-panel top-0" : "top-25 bg-background",
        "sticky z-10 col-span-2 grid h-[50px] w-full items-center justify-center",
      )}
      style={{
        gridTemplateColumns: "50px 1fr 30px",
      }}
    >
      {currentPage > 0 ? (
        <button
          onClick={onPrevPage}
          className="hover:bg-panel flex h-[30px] w-[30px] items-center justify-center rounded-full text-xl transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
      ) : (
        <div style={{ width: "30px" }} />
      )}

      {/* This container takes up the '1fr' space */}
      <div className="relative grid h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: ["easeIn", "easeOut"] }}
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
                  <div>{weekday}</div>
                  {!isWeekdayEvent && (
                    <div>
                      {month} {parseInt(day, 10)}
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
          className="hover:bg-panel flex h-[30px] w-[30px] items-center justify-center rounded-full text-xl transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      ) : (
        <div style={{ width: "30px" }} />
      )}
    </div>
  );
}
