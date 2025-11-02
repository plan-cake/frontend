"use client";

import { useEffect } from "react";

import ActionButton from "@/features/button/components/action-button";

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
      <h2 className="mb-4 text-2xl font-bold">Oops! Something went wrong.</h2>

      <p className="text-red mb-6 max-w-md">{error.message}</p>

      <ActionButton
        buttonStyle="primary"
        label="Try Again"
        onClick={() => {
          reset();
          return true;
        }}
      />
    </div>
  );
}
