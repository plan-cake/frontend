import { useState, useEffect } from "react";

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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Progress.Root
      className={cn(
        "absolute bottom-0 left-0 z-0 h-full w-full overflow-hidden",
        className,
      )}
      value={progress}
    >
      <Progress.Indicator
        className={cn(
          "rounded-r-4xl h-full w-full transform transition-transform ease-linear will-change-transform",
        )}
        style={{
          transform: `translateX(-${100 - progress}%)`,
          transitionDuration: `${duration}ms`,
          backgroundColor: `color-mix(in oklab, var(--color-${backgroundColor}) 100%, var(--color-background) 20%)`,
        }}
      />
    </Progress.Root>
  );
}
