"use client";

import { cn } from "@/app/_lib/classname";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";

export type DashboardCopyButtonProps = {
  code: string;
};

export default function DashboardCopyButton({
  code,
}: DashboardCopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const copiedTimeRef = useRef<NodeJS.Timeout | null>(null);

  const eventUrl =
    typeof window !== "undefined" ? `${window.location.origin}/${code}` : "";

  async function copyLink(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    await navigator.clipboard.writeText(eventUrl);
    setIsCopied(true);
    if (copiedTimeRef.current) {
      clearTimeout(copiedTimeRef.current);
    }
    copiedTimeRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  }

  return (
    <button
      onClick={copyLink}
      className={cn(
        "flex cursor-pointer items-center gap-0.5 rounded-full border border-violet px-2 py-1.5 dark:border-white",
        "transition hover:bg-violet/25 dark:hover:bg-white/25",
      )}
    >
      {isCopied ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
      <span className="ml-1 text-xs">Copy Link</span>
    </button>
  );
}
