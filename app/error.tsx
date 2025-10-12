"use client";

import { useEffect } from "react";

export default function EventErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // You can log the error to an error reporting service like Sentry
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center rounded-lg p-8 text-center">
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
        Oops! Something went wrong.
      </h2>

      <p className="mb-6 max-w-md text-red">{error.message}</p>

      <button
        onClick={() => reset()}
        className="rounded-full border-2 border-blue bg-blue px-6 py-2 text-white transition-shadow hover:shadow-lg dark:border-red dark:bg-red"
      >
        Try Again
      </button>
    </div>
  );
}
