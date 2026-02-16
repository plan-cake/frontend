import { cn } from "@/lib/utils/classname";

export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-[1.5px] border-white",
        className,
        "border-t-transparent dark:border-t-transparent", // don't ask
      )}
    />
  );
}
