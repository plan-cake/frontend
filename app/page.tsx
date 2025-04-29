"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter().push;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 space-y-4 text-xl md:text-2xl">
      <button
        onClick={() => router("/newevent")}
        className="pointer-events-auto h-1/4 w-3/4 rounded-xl bg-dblue p-4 text-white dark:bg-white dark:text-dblue"
      >
        create new event
      </button>
      <input
        type="text"
        id="event-code"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            router("/schedule/availability/" + e.currentTarget.value);
          }
        }}
        placeholder="or enter code here"
        className="w-3/4 border-b-2 text-center focus:outline-none"
      />
    </div>
  );
}
