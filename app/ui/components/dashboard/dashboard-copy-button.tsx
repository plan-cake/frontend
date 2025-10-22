import { MouseEvent } from "react";
import { CopyIcon } from "@radix-ui/react-icons";

import { cn } from "@/app/_lib/classname";
import { useToast } from "@/app/_lib/toast-context";

export type DashboardCopyButtonProps = {
  code: string;
};

export default function DashboardCopyButton({
  code,
}: DashboardCopyButtonProps) {
  const { addToast } = useToast();
  const eventUrl =
    typeof window !== "undefined" ? `${window.location.origin}/${code}` : "";

  const copyToClipboard = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // avoid triggering the parent link
    try {
      await navigator.clipboard.writeText(eventUrl);
      addToast({
        type: "success",
        id: Date.now() + Math.random(),
        title: "COPIED EVENT LINK!",
        message: eventUrl,
        icon: <CopyIcon className="col-start-1 row-span-2 h-5 w-5" />,
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
      addToast({
        type: "error",
        id: Date.now() + Math.random(),
        title: "COPY FAILED",
        message: "Could not copy link to clipboard.",
      });
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className={cn(
        "flex cursor-pointer items-center gap-0.5 rounded-full border border-violet px-2 py-1.5 dark:border-white",
        "transition hover:bg-violet/25 dark:hover:bg-white/25",
      )}
    >
      <CopyIcon className="h-4 w-4" />
      <span className="ml-1 text-xs">Copy Link</span>
    </button>
  );
}
