"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon } from "@radix-ui/react-icons";

export default function NewEventButton() {
  const pathname = usePathname();

  if (pathname === "/new-event") {
    return null;
  }

  return (
    <Link
      className="flex cursor-pointer flex-row items-center gap-1 rounded-full bg-blue p-2 font-medium text-white md:pr-4 md:pl-2.5 dark:bg-red"
      href="/new-event"
      aria-label="Create new event"
    >
      <PlusIcon className="h-5 w-5" />
      <span className="hidden md:inline">New Event</span>
    </Link>
  );
}
