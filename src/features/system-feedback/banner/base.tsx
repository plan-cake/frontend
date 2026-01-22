import { BANNER_CONFIG } from "@/features/system-feedback/banner/config";
import { BannerType } from "@/features/system-feedback/type";
import { cn } from "@/lib/utils/classname";

type BannerProps = {
  type: BannerType; // "success" | "error" | "info"
  title?: string;
  className?: string;
  noTitle?: boolean;
  showPing?: boolean;

  children: React.ReactNode;
};

export function Banner({
  title,
  type,
  className,
  noTitle = false,
  showPing = false,
  children,
}: BannerProps) {
  const Icon = BANNER_CONFIG[type].icon;

  return (
    <div
      className={cn(
        `bg-accent/20 flex items-center gap-4 rounded-3xl p-4`,
        className,
      )}
    >
      <div className="relative flex">
        {showPing && (
          <span className="bg-accent/50 absolute inline-flex h-full w-full animate-ping rounded-full"></span>
        )}
        <Icon className="h-5 w-5 shrink-0" />
      </div>
      <div>
        {!noTitle && <h2 className="text-lg font-bold">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
