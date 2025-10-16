"use client";

import { useEffect, useState } from "react";
import formatApiError from "../_utils/format-api-error";
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  participants: string[];
};

export default function Page() {
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/get", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          const newJoinedEvents: Event[] = [];
          data.participated_events.map((event: any) => {
            newJoinedEvents.push({
              id: event.event_code,
              title: event.title,
              participants: event.participants.map((p: string) =>
                p.slice(0, 1).toUpperCase(),
              ),
            });
          });
          setJoinedEvents(newJoinedEvents);
          const newCreatedEvents: Event[] = [];
          data.created_events.map((event: any) => {
            newCreatedEvents.push({
              id: event.event_code,
              title: event.title,
              participants: event.participants.map((p: string) =>
                p.slice(0, 1).toUpperCase(),
              ),
            });
          });
          setCreatedEvents(newCreatedEvents);
        } else {
          alert(formatApiError(await res.json()));
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("An error occurred while fetching dashboard data.");
      });
  }, []);

  const renderParticipants = (participants: string[]) => {
    const visible = participants.slice(0, 4);
    const extraCount = participants.length - visible.length;

    return (
      <>
        {visible.map((p, i) => (
          <div
            key={i}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs"
          >
            {p}
          </div>
        ))}
        {extraCount > 0 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-xs text-white">
            +{extraCount}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="sticky top-0 z-10 h-25 w-full bg-white dark:bg-violet" />
      {/* Events You Joined */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Events You Joined</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {joinedEvents.map((event) => (
            <div key={event.id} className="flex flex-col items-center">
              <Link
                href={`/${event.id}`}
                className="flex h-40 w-full flex-col justify-end rounded-lg bg-gray-200 p-4 text-black shadow transition hover:shadow-lg"
              >
                <div className="flex gap-1">
                  {renderParticipants(event.participants)}
                </div>
              </Link>
              <Link href={`/${event.id}`}>
                <h3 className="mt-2 text-center font-semibold">
                  {event.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Events You Created */}
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Events You Created</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {createdEvents.map((event) => (
            <div key={event.id} className="flex flex-col items-center">
              <Link
                href={`/${event.id}`}
                className="flex h-40 w-full flex-col justify-end rounded-lg bg-gray-200 p-4 text-black shadow transition hover:shadow-lg"
              >
                <div className="flex gap-1">
                  {renderParticipants(event.participants)}
                </div>
              </Link>
              <Link href={`/${event.id}`}>
                <h3 className="mt-2 text-center font-semibold">
                  {event.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
