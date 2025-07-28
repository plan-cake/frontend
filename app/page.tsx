"use client";

import Link from "next/link";
import HamburgerMenu from "./ui/components/hamburger-menu";

export default function Home() {
  return (
    <main className="min-h-screen bg-white transition-colors duration-300 dark:bg-violet">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-12">
            <span className="block text-5xl font-light text-violet dark:text-bone md:text-7xl">
              planning made
            </span>
            <span className="mt-4 block text-center font-display text-6xl leading-none text-lion md:text-8xl">
              stack
              <br />
              simple
            </span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-violet dark:text-bone">
            The fluffiest way to coordinate schedules and plan group events. Stack up availability and serve the perfect meeting time.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/new-event"
              className="rounded-2xl bg-red px-8 py-3 text-lg font-medium text-white transition-all hover:bg-red-400 hover:shadow-lg"
            >
              Mix your first plan
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl bg-blue px-8 py-3 text-lg font-medium text-white transition-all hover:bg-blue-400 hover:shadow-lg"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Why Plancake Section */}
      <section className="bg-bone py-16 dark:bg-violet">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Pancake emoji - centered on mobile */}
            <div className="flex justify-center order-1 md:order-1">
              <div className="text-8xl">🥞</div>
            </div>
            
            {/* Content - centered on mobile, left-aligned on desktop */}
            <div className="text-center md:text-left order-2 md:order-2">
              <h2 className="bubble-text text-4xl text-violet dark:text-bone md:text-6xl mb-8">
                why
                <br />
                <span className="text-violet dark:text-bone">plancake?</span>
              </h2>
              <div className="space-y-6">
                <div className="bg-white/80 dark:bg-violet-600/80 p-6 rounded-xl backdrop-blur">
                  <h3 className="text-xl font-semibold text-violet dark:text-bone mb-2">
                    Smart Planning
                  </h3>
                  <p className="text-violet dark:text-bone">
                    Intelligently suggest optimal meeting times based on everyone&apos;s availability and preferences.
                  </p>
                </div>
                <div className="bg-white/80 dark:bg-violet-600/80 p-6 rounded-xl backdrop-blur">
                  <h3 className="text-xl font-semibold text-violet dark:text-bone mb-2">
                    Easy Coordination
                  </h3>
                  <p className="text-violet dark:text-bone">
                    Share a simple link and watch as responses stack up in real-time without the back-and-forth.
                  </p>
                </div>
                <div className="bg-white/80 dark:bg-violet-600/80 p-6 rounded-xl backdrop-blur">
                  <h3 className="text-xl font-semibold text-violet dark:text-bone mb-2">
                    Perfect Results
                  </h3>
                  <p className="text-violet dark:text-bone">
                    Get the ideal meeting time that works for everyone with automatic calendar integration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Golden Stack Recipe */}
      <section className="bg-white py-16 dark:bg-violet">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="bubble-text text-4xl text-violet dark:text-bone md:text-6xl">
              golden
              <br />
              <span className="text-lion">stack recipe</span>
            </h2>
            <p className="mt-6 text-lg text-violet dark:text-bone max-w-2xl mx-auto">
              Follow these simple steps to cook up the perfect schedule every time.
            </p>
          </div>

          <div className="bg-bone dark:bg-violet-600 rounded-3xl p-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-6 bg-red w-20 h-20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🍳</span>
                </div>
                <h3 className="mb-4 text-xl font-semibold text-violet dark:text-bone">
                  Mix your event
                </h3>
                <p className="text-sm text-violet dark:text-bone">
                  Set up your meeting details, add time options, and customize your preferences
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-6 bg-violet w-20 h-20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">📤</span>
                </div>
                <h3 className="mb-4 text-xl font-semibold text-violet dark:text-bone">
                  Share & Stack
                </h3>
                <p className="text-sm text-violet dark:text-bone">
                  Send the link to participants and watch responses stack up in real-time
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-6 bg-lion w-20 h-20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🥞</span>
                </div>
                <h3 className="mb-4 text-xl font-semibold text-violet dark:text-bone">
                  Flip & Serve
                </h3>
                <p className="text-sm text-violet dark:text-bone">
                  Review the results, pick the best time, and serve up calendar invites to all
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Today Section */}
      <section className="bg-bone py-16 dark:bg-violet">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="bubble-text text-6xl text-violet dark:text-bone md:text-8xl mb-8">
            PLAN TODAY
          </h2>
          <div className="mt-8">
            <Link
              href="/new-event"
              className="inline-block rounded-lg bg-red px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-red-400 hover:shadow-xl"
            >
              Start Planning
            </Link>
          </div>
          <div className="mt-12">
            <div className="text-lion font-display text-2xl mb-2">plancake</div>
            <p className="text-sm text-violet dark:text-bone">
              © 2025 plancake. Stacking up perfect plans, one pancake at a time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}