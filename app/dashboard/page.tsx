"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import formatApiError from "../_utils/format-api-error";

type Event = {
  id: string;
  title: string;
  participants: string[];
};

export default function Page() {
  const router = useRouter();
  const isSubmitting = useRef(false);

  // Mock data for testing
  const joinedEvents: Event[] = [
    {
      id: "1",
      title: "Dinner With Friends",
      participants: ["A", "B", "C", "D", "E", "F"],
    },
    { id: "2", title: "Board Game Night", participants: ["D", "E"] },
    {
      id: "3",
      title: "Dungeons & Dragons ",
      participants: ["F", "G", "H", "I"],
    },
    { id: "4", title: "Project Meeting", participants: ["I", "J", "K"] },
    {
      id: "5",
      title: "Competitive Slug Racing",
      participants: ["L", "M", "N", "O", "P"],
    },
  ];

  const createdEvents: Event[] = [
    { id: "6", title: "Study Session", participants: ["I", "J", "K"] },
    {
      id: "7",
      title: "Eboard Meeting",
      participants: ["L", "M", "N", "O", "P"],
    },
  ];

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

  const logout = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    await fetch("/api/auth/logout/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (res.ok) {
          router.push("/login");
        } else {
          alert(formatApiError(await res.json()));
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("An error occurred. Please try again.");
      });

    isSubmitting.current = false;
  };

  return (
    <div className="min-h-screen p-6">
      {/* Events You Joined */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Events You Joined</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {joinedEvents.map((event) => (
            <div key={event.id} className="flex flex-col items-center">
              <div className="flex h-40 w-full flex-col justify-end rounded-lg bg-gray-200 p-4 text-black shadow transition hover:shadow-lg">
                <div className="flex gap-1">
                  {renderParticipants(event.participants)}
                </div>
              </div>
              <h3 className="mt-2 text-center font-semibold">{event.title}</h3>
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
              <div className="flex h-40 w-full flex-col justify-end rounded-lg bg-gray-200 p-4 text-black shadow transition hover:shadow-lg">
                <div className="flex gap-1">
                  {renderParticipants(event.participants)}
                </div>
              </div>
              <h3 className="mt-2 text-center font-semibold">{event.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Logout Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={logout}
          className="mb-2 cursor-pointer rounded-full bg-blue px-4 py-2 font-medium transition dark:bg-red"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
