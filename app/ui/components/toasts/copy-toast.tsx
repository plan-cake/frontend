"use client";

import { CopyIcon } from "@radix-ui/react-icons";
import { useToast } from "@/app/_lib/toast-context";

export default function CopyToast({ code }: { code: string }) {
  const { addToast } = useToast();
  const currentURL =
    typeof window !== "undefined" ? `${window.location.origin}/${code}` : "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentURL);
      addToast({
        type: "success",
        id: Date.now() + Math.random(),
        title: "COPIED EVENT LINK!",
        message: currentURL,
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
      className="flex flex-row items-center gap-2 rounded-full border-2 border-blue p-2 text-sm hover:bg-blue-100 dark:border-red dark:hover:bg-red/25"
      onClick={copyToClipboard}
    >
      <CopyIcon className="h-5 w-5" />
      <span>Copy Link</span>
    </button>
  );
}
