"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";

import LinkButton from "@/features/button/components/link-button";

export default function NewEventButton() {
  const pathname = usePathname();

  if (pathname === "/new-event") {
    return null;
  }

  return (
    <LinkButton
      buttonStyle="primary"
      icon={<PlusIcon />}
      label="New Event"
      shrinkOnMobile
      href="/new-event"
    />
  );
}
