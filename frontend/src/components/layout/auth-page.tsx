import React from "react";

import { AuthFieldArray } from "@/features/auth/auth-array";
import { RateLimitBanner } from "@/features/system-feedback";

interface AuthPageLayoutProps {
  title: string;
  fields: AuthFieldArray;
  children: React.ReactNode;
  rateLimitError?: string;
}

export default function AuthPageLayout({
  title,
  fields,
  children,
  rateLimitError,
}: AuthPageLayoutProps) {
  const stopRefresh = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <form
        onSubmit={stopRefresh}
        className="flex w-80 flex-col items-center gap-4"
      >
        {/* Title */}
        <h1 className="font-display text-lion block text-center text-5xl leading-none md:text-8xl">
          {title}
        </h1>

        {/* Rate Limit Error */}
        {rateLimitError && <RateLimitBanner>{rateLimitError}</RateLimitBanner>}

        {/* Render fields */}
        {fields.map((field, index) => (
          <React.Fragment key={index}>{field}</React.Fragment>
        ))}

        {/* Page-specific content (buttons, links, checkboxes, etc.) */}
        {/* Given its own div to avoid gap affecting the content in unintended ways */}
        <div className="w-full">{children}</div>
      </form>
    </div>
  );
}
