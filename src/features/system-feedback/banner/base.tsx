import { BANNER_CONFIG } from "@/features/system-feedback/banner/config";
import { BannerType } from "@/features/system-feedback/type";
import { cn } from "@/lib/utils/classname";

type BannerProps = {
  type: BannerType; // "success" | "error" | "info"
  title: string;
  className?: string;

  children: React.ReactNode;
};

export function Banner({ title, type, className, children }: BannerProps) {
  const Icon = BANNER_CONFIG[type].icon;

  return (
    <div
      className={cn(
        `bg-accent/20 flex items-center gap-4 rounded-3xl p-4`,
        className,
      )}
    >
      <Icon className="h-5 w-5" />
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {children}
      </div>
    </div>
  );
}
