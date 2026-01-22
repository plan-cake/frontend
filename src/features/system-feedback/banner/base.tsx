import { BANNER_CONFIG } from "@/features/system-feedback/banner/config";
import { BannerType } from "@/features/system-feedback/type";
import { cn } from "@/lib/utils/classname";

type BaseBannerProps = {
  type: BannerType;
  className?: string;
  showPing?: boolean;
  children: React.ReactNode;
};

type WithTitle = BaseBannerProps & {
  noTitle?: false;
  title: string;
};

type WithoutTitle = BaseBannerProps & {
  noTitle: true;
  title?: never;
};

type BannerProps = WithTitle | WithoutTitle;

export function Banner({
  type,
  className,
  showPing = false,
  children,
  ...props
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
        {!props.noTitle && <h2 className="text-lg font-bold">{props.title}</h2>}
        {children}
      </div>
    </div>
  );
}
