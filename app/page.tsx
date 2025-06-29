import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white transition-colors duration-300 dark:bg-[#3e3c53]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-8">
            <Image
              src="/plancake-light.png"
              alt="Plancake Logo"
              width={100}
              height={75}
              className="mx-auto block dark:hidden"
            />
            <Image
              src="/plancake-dark.png"
              alt="Plancake Logo"
              width={100}
              height={75}
              className="mx-auto hidden dark:block"
            />
          </div>
          <h1 className="mb-6 text-5xl text-violet dark:text-bone md:text-7xl">
            planning made
            <span className="mt-2 block bubble-text text-lion">stack simple</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-violet dark:text-bone md:text-2xl">
            The fluffiest way to coordinate schedules and plan group events.
            Stack up availability and serve the perfect meeting time.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/new-event"
              className="rounded-lg bg-[#ff6b6b] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-[#ff5252] hover:shadow-xl"
            >
              Mix your first plan
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-[#4d79e9] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-[#4d69e9] hover:shadow-xl"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Why Plancake Section */}
      <section className="bg-bone py-20 dark:bg-[#2e2c43]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="bubble-text text-4xl text-violet dark:text-outline-light md:text-6xl">
              why plancake?
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="rounded-xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:bg-[#3e3c53]">
                <Image
                  src="/pancake-stack.png"
                  alt="Smart Planning"
                  width={64}
                  height={64}
                  className="mx-auto mb-4"
                />
                <h3 className="mb-4 text-2xl font-semibold text-violet dark:text-bone">
                  Smart Planning
                </h3>
                <p className="text-lg text-violet dark:text-bone">
                  Intelligently suggest optimal meeting times based on everyone's availability and preferences.
                </p>
              </div>
              <div className="rounded-xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:bg-[#3e3c53]">
                <Image
                  src="/pancake-stack.png"
                  alt="Smart Planning"
                  width={64}
                  height={64}
                  className="mx-auto mb-4"
                />
                <h3 className="mb-4 text-2xl font-semibold text-violet dark:text-bone">
                  Smart Planning
                </h3>
                <p className="text-lg text-violet dark:text-bone">
                  Intelligently suggest optimal meeting times based on everyone's availability and preferences.
                </p>
              </div>
              <div className="rounded-xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:bg-[#3e3c53]">
                <Image
                  src="/pancake-stack.png"
                  alt="Smart Planning"
                  width={64}
                  height={64}
                  className="mx-auto mb-4"
                />
                <h3 className="mb-4 text-2xl font-semibold text-violet dark:text-bone">
                  Smart Planning
                </h3>
                <p className="text-lg text-violet dark:text-bone">
                  Intelligently suggest optimal meeting times based on everyone's availability and preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Golden Stack Recipe */}
      <section className="bg-white py-20 dark:bg-[#3e3c53]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="bubble-text text-4xl text-violet dark:text-bone md:text-6xl">
              golden
              <span className="block text-lion">stack recipe</span>
            </h2>
            <p className="mt-4 text-lg text-violet dark:text-bone">
              Follow these simple steps to cook up the perfect schedule every time.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6">
                <Image
                  src="/mixer.png"
                  alt="Mix your event"
                  width={100}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-violet dark:text-bone">
                Mix your event
              </h3>
              <p className="text-lg text-violet dark:text-bone">
                Set up your meeting details, add time options, and customize your preferences
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6">
                <Image
                  src="/pan.png"
                  alt="Share & Stack"
                  width={100}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-violet dark:text-bone">
                Share & Stack
              </h3>
              <p className="text-lg text-violet dark:text-bone">
                Send the link to participants and watch responses stack up in real-time
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6">
                <Image
                  src="/pancakes.png"
                  alt="Flip & Serve"
                  width={100}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-violet dark:text-bone">
                Flip & Serve
              </h3>
              <p className="text-lg text-violet dark:text-bone">
                Review the results, pick the best time, and serve up calendar invites to all
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Today Section */}
      <section className="bg-bone py-20 dark:bg-[#2e2c43]">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="bubble-text text-6xl text-violet dark:text-outline-light md:text-8xl">
            PLAN TODAY
          </h2>
          <div className="mt-8">
            <Link
              href="/new-event"
              className="inline-block rounded-lg bg-[#ff6b6b] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-[#ff5252] hover:shadow-xl"
            >
              Start Planning
            </Link>
          </div>
          <div className="mt-12">
            <p className="text-sm text-violet dark:text-bone">
              © 2025 plancake. Stacking up perfect plans, one pancake at a time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
