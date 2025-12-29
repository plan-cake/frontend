import {
  CheckIcon,
  InfoCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils/classname";

type BannerTypes = "success" | "error" | "info";

type BannerProps = {
  type: BannerTypes;
  title: string;
  className?: string;

  children: React.ReactNode;
};

function getBannerIcon(iconType: BannerTypes) {
  const iconClass = "h-5 w-5";

  switch (iconType) {
    case "error":
      return <ExclamationTriangleIcon className={iconClass} />;
    case "success":
      return <CheckIcon className={iconClass} />;
    default:
      return <InfoCircledIcon className={iconClass} />;
  }
}

export function Banner({ title, type, className, children }: BannerProps) {
  return (
    <div
      className={cn(
        `bg-accent/20 flex items-center gap-4 rounded-3xl p-4`,
        className,
      )}
    >
      {getBannerIcon(type)}
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {children}
      </div>
    </div>
  );
}
