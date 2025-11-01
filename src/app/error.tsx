"use client";

import { useEffect } from "react";

function getErrorDetails(error: Error) {
  let status = 500; // Default error code
  let message = error.message; // Default message
  let title = "Oops! Something went wrong."; // Default title

  try {
    // Try to parse the message as JSON
    const errorData = JSON.parse(error.message);

    // Check if it's our structured error
    if (
      typeof errorData === "object" &&
      errorData !== null &&
      "status" in errorData &&
      "title" in errorData &&
      "message" in errorData
    ) {
      status = errorData.status;
      title = errorData.title;
      message = errorData.message;
    }
  } catch {
    // If parsing fails, we just use the original message and default status
  }

  return { statusCode: String(status), title, message };
}

export default function EventErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Use the helper to get the details
  const { statusCode, title, message } = getErrorDetails(error);

  return (
    <div className="flex h-screen flex-col items-center justify-center rounded-lg p-8 text-center">
      <h1 className="font-display dark:text-lion text-lion-400 mb-4 block text-5xl leading-none md:text-[13rem]">
        {statusCode}
      </h1>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <p className="mb-6 max-w-md">{message}</p>

      <button
        onClick={() => reset()}
        className="border-blue bg-blue dark:border-red dark:bg-red rounded-full border-2 px-6 py-2 text-white transition-shadow hover:shadow-lg"
      >
        Try Again
      </button>
    </div>
  );
}
