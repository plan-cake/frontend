import { BANNER_CONFIG } from "@/features/system-feedback/banner/config";
import { BannerType } from "@/features/system-feedback/type";
import { cn } from "@/lib/utils/classname";

type BannerProps = {
  type: BannerType;
  className?: string;
  showPing?: boolean;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export function Banner({
  type,
  className,
  showPing = false,
  title,
  subtitle,
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
          <span className="bg-accent/50 absolute z-0 inline-flex h-full w-full animate-ping rounded-full"></span>
        )}
        <Icon className="relative z-10 h-5 w-5 shrink-0" />
      </div>
      <div>
        {(title || subtitle) && (
          <div className="mb-1">
            {title && <h2 className="text-lg font-bold">{title}</h2>}
            {subtitle && <p className="font-semibold">{subtitle}</p>}
          </div>
        )}
        {children && <div className="text-sm">{children}</div>}
      </div>
    </div>
  );
}
