import * as Toast from "@radix-ui/react-toast";
import { cn } from "@/src/lib/utils/classname";

export default function SuccessToast({
  open,
  onOpenChange,
  title,
  message,
  icon,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  icon: React.ReactNode;
}) {
  return (
    <Toast.Root
      className={cn(
        "grid grid-cols-[auto_auto] items-center gap-x-[15px] rounded-full bg-lion px-6 py-3 text-white shadow-xl",
        "border border-lion",
        "data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
      )}
      open={open}
      onOpenChange={onOpenChange}
      duration={3000}
    >
      {icon}
      <Toast.Title className="col-start-2 flex text-sm font-bold">
        {title}
      </Toast.Title>
      <Toast.Description asChild>
        <div className="col-start-2 m-0 text-[13px] leading-[1.3]">
          {message}
        </div>
      </Toast.Description>
    </Toast.Root>
  );
}
