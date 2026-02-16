import * as Progress from "@radix-ui/react-progress";

import { cn } from "@/lib/utils/classname";

type ProgressBarProps = {
  duration: number;
  className?: string;
  backgroundColor?: string;
  isPaused: boolean;
};

export default function ProgressBar({
  duration,
  className,
  backgroundColor,
  isPaused,
}: ProgressBarProps) {
  return (
    <Progress.Root
      className={cn(
        "absolute bottom-0 left-0 z-0 h-full w-full overflow-hidden",
        className,
      )}
      value={null}
    >
      <Progress.Indicator
        className={cn("rounded-r-4xl h-full w-full")}
        style={{
          animationName: "toast-progress",
          animationDuration: `${duration}ms`,
          animationTimingFunction: "linear",
          animationFillMode: "forwards",
          animationPlayState: isPaused ? "paused" : "running",
          backgroundColor: `color-mix(in oklab, var(--color-${backgroundColor}) 100%, var(--color-background) 20%)`,
        }}
      />
    </Progress.Root>
  );
}
