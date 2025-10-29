import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import * as Toast from "@radix-ui/react-toast";

import { cn } from "@/lib/utils/classname";

export default function ErrorToast({
  error = "An error occurred",
  label = "ERROR",
  open,
  onOpenChange,
}: {
  error?: string;
  label?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Toast.Root
      className={cn(
        "bg-red grid w-fit grid-cols-[auto_auto] items-center gap-x-[15px] rounded-full px-6 py-3 text-white shadow-xl",
        "border-red border dark:border-red-400",
        "data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[transform_200ms_ease-out]",
      )}
      open={open}
      onOpenChange={onOpenChange}
      duration={3000}
    >
      <ExclamationTriangleIcon className="col-start-1 row-span-2 h-5 w-5" />
      <Toast.Title className="col-start-2 flex text-sm font-bold">
        {label}
      </Toast.Title>
      <Toast.Description asChild>
        <div className="col-start-2 m-0 text-[13px] leading-[1.3]">{error}</div>
      </Toast.Description>
    </Toast.Root>
  );
}
