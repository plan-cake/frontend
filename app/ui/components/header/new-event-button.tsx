"use client";

import Link from "next/link";

export default function NewEventButton() {
  return (
    <Link
      className="cursor-pointer rounded-full bg-red px-4 py-2 font-medium"
      href="/new-event"
      aria-label="Create new event"
    >
      New Event
    </Link>
  );
}
