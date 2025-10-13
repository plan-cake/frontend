import Link from "next/link";
import Logo from "./ui/components/logo";

export default function Home() {
  return (
    <main className="min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-12">
            <span className="block text-5xl font-light md:text-7xl">
              planning made
            </span>
            <span className="font-display mt-4 block text-center text-6xl leading-none text-lion md:text-8xl">
              stack
              <br />
              simple
            </span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed">
            The fluffiest way to coordinate schedules and plan group events.
            Stack up availability and serve the perfect meeting time.
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
      <section className="bg-bone py-16 dark:bg-gray-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Pancake emoji - centered on mobile */}
            <div className="order-1 flex justify-center md:order-1">
              <div className="text-8xl">🥞</div>
            </div>

            {/* Content - centered on mobile, left-aligned on desktop */}
            <div className="order-2 text-center md:order-2 md:text-left">
              <h2 className="bubble-text mb-8 text-4xl text-violet md:text-6xl dark:text-bone">
                why
                <br />
                <span className="text-violet dark:text-bone">plancake?</span>
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-violet dark:text-bone">
                    Smart Planning
                  </h3>
                  <p className="text-violet dark:text-bone">
                    Intelligently suggest optimal meeting times based on
                    everyone&apos;s availability.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-violet dark:text-bone">
                    Easy Coordination
                  </h3>
                  <p className="text-violet dark:text-bone">
                    Share a simple link and watch as responses stack up without
                    the back-and-forth.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-violet dark:text-bone">
                    Perfect Results
                  </h3>
                  <p className="text-violet dark:text-bone">
                    Get the ideal meeting time that works for everyone with an
                    intuitive graph view.
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
            <h2 className="bubble-text text-4xl md:text-6xl">
              golden
              <br />
              <span className="text-lion">stack recipe</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg">
              Follow these simple steps to cook up the perfect schedule every
              time.
            </p>
          </div>

          <div className="rounded-3xl bg-bone p-8 text-violet dark:bg-gray-300">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-lion">
                  <span className="text-3xl">🍳</span>
                </div>
                <h3 className="mb-4 text-xl font-semibold">Mix your event</h3>
                <p className="text-sm">
                  Set up your meeting details, add time options, and customize
                  your preferences
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet">
                  <span className="text-3xl">📤</span>
                </div>
                <h3 className="mb-4 text-xl font-semibold">Share & Stack</h3>
                <p className="text-sm">
                  Send the link to participants and watch responses stack up in
                  a flash
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-lion">
                  <span className="text-3xl">🥞</span>
                </div>
                <h3 className="mb-4 text-xl font-semibold">Flip & Serve</h3>
                <p className="text-sm">
                  Review the results and serve up the ideal meeting time for
                  everyone
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Today Section */}
      <section className="bg-bone py-16 text-violet dark:bg-gray-300">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="bubble-text mb-8 text-6xl md:text-8xl">PLAN TODAY</h2>
          <div className="mt-8">
            <Link
              href="/new-event"
              className="inline-block rounded-lg bg-red px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-red-400 hover:shadow-xl"
            >
              Start Planning
            </Link>
          </div>
          <div className="mt-12">
            <div className="mb-2">
              <Logo />
            </div>
            <p className="text-sm">
              © 2025 Plancake. Stacking up perfect plans, one pancake at a
              time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
