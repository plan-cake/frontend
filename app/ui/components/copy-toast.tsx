"use client";

import { useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { CopyIcon } from "@radix-ui/react-icons";
import { cn } from "@/app/_lib/classname";

export default function CopyToast({
  eventLink = "plancake.com/event/12345",
  label = "Event Link",
}) {
  const [open, setOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(eventLink);
      setOpen(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <button
        className="rounded-full border-2 border-blue px-4 py-2 text-sm hover:bg-blue-100 dark:border-red dark:hover:bg-red/25"
        onClick={copyToClipboard}
      >
        <span className="hidden md:block">{label}</span>
        <span className="md:hidden">
          <CopyIcon width={16} height={16} />
        </span>
      </button>

      <Toast.Root
        className={cn(
          "grid grid-cols-[auto_auto] items-center gap-x-[15px] rounded-full bg-blue p-[15px] text-white shadow-xl",
          "border border-blue",
          "data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
        )}
        open={open}
        onOpenChange={setOpen}
        duration={3000}
      >
        <CopyIcon className="col-start-1 row-span-2 h-5 w-5" />
        <Toast.Title className="col-start-2 flex text-sm font-bold">
          COPIED EVENT LINK!
        </Toast.Title>
        <Toast.Description asChild>
          <div className="col-start-2 m-0 text-[13px] leading-[1.3]">
            {eventLink}
          </div>
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="fixed right-0 bottom-10 z-[2147483647] m-0 flex list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px] md:bottom-0" />
    </Toast.Provider>
  );
}
