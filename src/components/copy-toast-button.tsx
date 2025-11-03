"use client";

import { CopyIcon } from "@radix-ui/react-icons";

import ActionButton from "@/features/button/components/action";
import { useToast } from "@/features/toast/context";

export default function CopyToastButton({ code }: { code: string }) {
  const { addToast } = useToast();
  const currentURL =
    typeof window !== "undefined" ? `${window.location.origin}/${code}` : "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentURL);
      addToast("copy", "Link copied to clipboard!");
      return true;
    } catch (err) {
      console.error("Failed to copy: ", err);
      addToast("error", "Could not copy link to clipboard.");
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
