import React from "react";

import { RateLimitBanner } from "@/features/system-feedback";

interface AuthPageLayoutProps {
  title: string;
  children: React.ReactNode;
  rateLimitError?: string;
}

export default function AuthPageLayout({
  title,
  children,
  rateLimitError,
}: AuthPageLayoutProps) {
  const stopRefresh = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <form onSubmit={stopRefresh} className="flex w-80 flex-col items-center">
        {/* Title */}
        <h1 className="font-display text-lion mb-4 block text-center text-5xl leading-none md:text-8xl">
          {title}
        </h1>

        {/* Rate Limit Error */}
        {rateLimitError && <RateLimitBanner>{rateLimitError}</RateLimitBanner>}

        {/* Page-specific content */}
        {children}
      </form>
    </div>
  );
}
