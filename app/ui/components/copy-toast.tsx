"use client";

import { useEffect, useRef, useState } from "react";
import * as Toast from "@radix-ui/react-toast";

import { CopyIcon } from "@radix-ui/react-icons";

export default function CopyToast({
  eventLink = "plancake.com/event/12345",
  label = "Event Link",
}) {
  const [open, setOpen] = useState(false);
  const eventDateRef = useRef(new Date());
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(eventLink);
      setOpen(true);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setOpen(false);
      }, 2000);
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
        className="grid grid-cols-[auto_max-content] items-center gap-x-2 rounded-full bg-white px-8 py-2 shadow-[0px_10px_32px_0_rgba(61,115,163,.70)] [grid-template-areas:_'title_action'_'description_action'] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] dark:bg-violet dark:shadow-[0px_10px_32px_0_rgba(255,92,92,.70)]"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="text-sm font-bold [grid-area:_title]">
          Copied: Event Link
        </Toast.Title>
        <Toast.Description asChild>
          <div className="m-0 text-[13px] leading-[1.3] [grid-area:_description]">
            {eventLink}
          </div>
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="fixed right-0 bottom-10 z-[2147483647] m-0 flex list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px] md:bottom-0" />
    </Toast.Provider>
  );
}
