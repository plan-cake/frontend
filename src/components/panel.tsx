import { cn } from "@/lib/utils/classname";

export default function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-panel rounded-3xl p-6", className)}>{children}</div>
  );
}
