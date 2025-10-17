"use client";

import { CopyIcon } from "@radix-ui/react-icons";
import { useToast } from "@/app/_lib/toast-context";

export default function CopyToast({
  eventLink = "plancake.com/event/12345",
  label = "Event Link",
}) {
  const { addToast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(eventLink);
      addToast({
        type: "success",
        id: Date.now() + Math.random(),
        title: "COPIED EVENT LINK!",
        message: eventLink,
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
      className="rounded-full border-2 border-blue px-4 py-2 text-sm hover:bg-blue-100 dark:border-red dark:hover:bg-red/25"
      onClick={copyToClipboard}
    >
      <span className="hidden md:block">{label}</span>
      <span className="md:hidden">
        <CopyIcon width={16} height={16} />
      </span>
    </button>
  );
}
