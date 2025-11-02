"use client";

import { MouseEvent } from "react";

import { CopyIcon } from "@radix-ui/react-icons";

import { useToast } from "@/features/toast/context";

export default function CopyToastButton({ code }: { code: string }) {
  const { addToast } = useToast();
  const currentURL =
    typeof window !== "undefined" ? `${window.location.origin}/${code}` : "";

  const copyToClipboard = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // avoid triggering the parent link

    try {
      await navigator.clipboard.writeText(currentURL);
      addToast("copy", "Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      addToast("error", "Could not copy link to clipboard.");
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
