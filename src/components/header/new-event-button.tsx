"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NewEventButton() {
  const pathname = usePathname();

  if (pathname === "/new-event") {
    return null;
  }

  return (
    <Link
      className="bg-blue dark:bg-red flex cursor-pointer flex-row items-center gap-1 rounded-full p-2 font-medium text-white md:pl-2.5 md:pr-4"
      href="/new-event"
      aria-label="Create new event"
    >
      <PlusIcon className="h-5 w-5" />
      <span className="hidden md:inline">New Event</span>
    </Link>
  );
}
