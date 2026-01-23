import { Cross2Icon } from "@radix-ui/react-icons";
import * as Toast from "@radix-ui/react-toast";

import { cn } from "@/lib/utils/classname";

type BaseToastProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  icon: React.ReactNode;
  toastStyle: string;
};

export default function BaseToast({
  open,
  onOpenChange,
  title,
  message,
  icon,
  toastStyle,
}: BaseToastProps) {
  return (
    <Toast.Root
      className={cn(
        "group grid grid-cols-[auto_auto] items-center gap-x-[15px] rounded-full px-6 py-3 text-white shadow-xl",
        toastStyle,
        "data-[state=closed]:animate-slideOut data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[transform_200ms_ease-out]",
      )}
      open={open}
      onOpenChange={onOpenChange}
      duration={3000}
    >
      {icon}

      <div className="col-start-2 flex flex-col">
        <Toast.Title className="flex text-sm font-bold">{title}</Toast.Title>
        <Toast.Description asChild>
          <div className="m-0 text-[13px] leading-[1.3]">{message}</div>
        </Toast.Description>
      </div>

      <Toast.Close asChild>
        <button
          type="button"
          aria-label="Close"
          onClick={() => {
            if (
              document.activeElement &&
              document.activeElement instanceof HTMLElement
            ) {
              // After clicking this button, the focus would be on the toasts.
              // If there is more than 1 toast, the focus causes the timers for all the
              // toasts to be paused until the user clicked on something else.
              // This just removes that focus.
              document.activeElement.blur();
            }
          }}
          className={cn(
            "col-start-3 row-span-2 flex h-6 w-6 items-center justify-center rounded-full",
            "opacity-0 transition-opacity duration-200 ease-in-out",
            "focus:opacity-100 group-hover:opacity-100",
            "hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50",
          )}
        >
          <Cross2Icon className="h-4 w-4" />
        </button>
      </Toast.Close>
    </Toast.Root>
  );
}
