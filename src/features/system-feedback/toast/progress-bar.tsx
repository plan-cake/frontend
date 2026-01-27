import * as Progress from "@radix-ui/react-progress";

import { cn } from "@/lib/utils/classname";

type ProgressBarProps = {
  duration: number;
  className?: string;
  backgroundColor?: string;
};

export default function ProgressBar({
  duration,
  className,
  backgroundColor,
}: ProgressBarProps) {
  return (
    <Progress.Root
      className={cn(
        "absolute bottom-0 left-0 z-0 h-full w-full overflow-hidden",
        className,
      )}
      // We set value to null/undefined as we are driving the visual state via CSS animation
      // to allow for pausing on hover.
      value={null}
    >
      <style>{`
        @keyframes toast-progress {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        /* Pause the animation when the parent 'group' (Toast.Root) is hovered */
        .group:hover .toast-progress-indicator {
          animation-play-state: paused;
        }
      `}</style>

      <Progress.Indicator
        className={cn("toast-progress-indicator rounded-r-4xl h-full w-full")}
        style={{
          animationName: "toast-progress",
          animationDuration: `${duration}ms`,
          animationTimingFunction: "linear",
          animationFillMode: "forwards",
          backgroundColor: `color-mix(in oklab, var(--color-${backgroundColor}) 100%, var(--color-background) 20%)`,
        }}
      />
    </Progress.Root>
  );
}
