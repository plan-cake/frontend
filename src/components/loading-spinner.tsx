import { cn } from "@/lib/utils/classname";

export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        className,
        "animate-spin rounded-full border-2 border-white border-t-transparent",
      )}
    />
  );
}
