"use client";

import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";

export default function NewEventButton() {
  const pathname = usePathname();

  if (pathname === "/new-event") {
    return null;
  }

  return (
    <Link
      className="flex cursor-pointer flex-row items-center gap-1 rounded-full bg-red p-2 font-medium md:pr-4 md:pl-2.5"
      href="/new-event"
      aria-label="Create new event"
    >
      <PlusIcon className="h-5 w-5" />
      <span className="hidden md:inline">New Event</span>
    </Link>
  );
}
