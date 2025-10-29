"use client";

import { CopyIcon } from "@radix-ui/react-icons";

import { useToast } from "@/features/toast/context";

export default function CopyToastButton({ code }: { code: string }) {
  const { addToast } = useToast();
  const currentURL =
    typeof window !== "undefined" ? `${window.location.origin}/${code}` : "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentURL);
      addToast({
        type: "copy",
        id: Date.now() + Math.random(),
        title: "COPIED EVENT LINK!",
        message: currentURL,
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
      className="border-blue dark:border-red dark:hover:bg-red/25 flex flex-row items-center gap-2 rounded-full border-2 p-2 text-sm hover:bg-blue-100"
      onClick={copyToClipboard}
    >
      <CopyIcon className="h-5 w-5" />
      <span>Copy Link</span>
    </button>
  );
}
