"use client";

import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";

export default function NewEventButton() {
  return (
    <Link
      className="flex cursor-pointer flex-row items-center gap-1 rounded-full bg-red py-2 pr-4 pl-2.5 font-medium"
      href="/new-event"
      aria-label="Create new event"
    >
      <PlusIcon className="h-5 w-5" />
      New Event
    </Link>
  );
}
