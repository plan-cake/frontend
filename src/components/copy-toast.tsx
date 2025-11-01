"use client";

import { CopyIcon } from "@radix-ui/react-icons";

import ActionButton from "@/features/button/components/action-button";
import { useToast } from "@/features/toast/context";

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
      return true;
    } catch (err) {
      console.error("Failed to copy: ", err);
      addToast({
        type: "error",
        id: Date.now() + Math.random(),
        title: "COPY FAILED",
        message: "Could not copy link to clipboard.",
      });
      return false;
    }
  };

  return (
    <ActionButton
      buttonStyle="secondary"
      icon={<CopyIcon />}
      label="Copy Link"
      onClick={copyToClipboard}
    />
  );
}
