import Link from "next/link";
import Image from "next/image";
import { FiSettings, FiShare2, FiCalendar } from "react-icons/fi";

const features = [
  {
    title: "Smart Planning",
    description:
      "Intelligently suggest optimal meeting times based on everyone's availability and preferences.",
    icon: <FiSettings className="h-8 w-8" />,
  },
  {
    title: "Share & Stack",
    description:
      "Send the link to participants and watch responses stack up in real-time.",
    icon: <FiShare2 className="h-8 w-8" />,
  },
  {
    title: "Flip & Serve",
    description:
      "Review the results, pick the best time, and serve up calendar invites to all.",
    icon: <FiCalendar className="h-8 w-8" />,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white transition-colors duration-300 dark:bg-[#3e3c53]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-8">
            <Image
              src="/tomeeto-light.png"
              alt="Plancake Logo"
              width={100}
              height={75}
              className="mx-auto block dark:hidden"
            />
            <Image
              src="/tomeeto-dark.png"
              alt="Plancake Logo"
              width={100}
              height={75}
              className="mx-auto hidden dark:block"
            />
          </div>
          <h1 className="mb-6 font-display text-5xl font-bold text-[#3e3c53] dark:text-[#e9deca] md:text-7xl">
            planning made
            <span className="mt-2 block font-display text-[#e9794d]">stack simple</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-[#3e3c53] dark:text-[#e9deca] md:text-2xl">
            The fluffiest way to coordinate schedules and plan group events.
            Stack up availability and serve the perfect meeting time.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/new-event"
              className="rounded-lg bg-[#e9794d] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-[#e9694d] hover:shadow-xl"
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
      <section className="bg-[#e9deca] py-20 dark:bg-[#2e2c43]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-display text-4xl text-[#3e3c53] dark:text-[#e9deca]">
              why plancake?
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:bg-[#3e3c53]"
                >
                  <div className="mb-4 text-[#e9794d]">{feature.icon}</div>
                  <h3 className="mb-4 text-2xl font-semibold text-[#3e3c53] dark:text-[#e9deca]">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-[#3e3c53] dark:text-[#e9deca]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Golden Stack Recipe */}
      <section className="bg-white py-20 dark:bg-[#3e3c53]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-display text-4xl text-[#3e3c53] dark:text-[#e9deca]">
              golden
              <span className="block font-display text-[#e9794d]">stack recipe</span>
            </h2>
            <p className="mt-4 text-lg text-[#3e3c53] dark:text-[#e9deca]">
              Follow these simple steps to cook up the perfect schedule every time.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6">
                <FiSettings className="mx-auto h-16 w-16 text-[#e9794d]" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-[#3e3c53] dark:text-[#e9deca]">
                Mix your event
              </h3>
              <p className="text-lg text-[#3e3c53] dark:text-[#e9deca]">
                Set up your meeting details, add time options, and customize your preferences
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6">
                <FiShare2 className="mx-auto h-16 w-16 text-[#e9794d]" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-[#3e3c53] dark:text-[#e9deca]">
                Share & Stack
              </h3>
              <p className="text-lg text-[#3e3c53] dark:text-[#e9deca]">
                Send the link to participants and watch responses stack up in real-time
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6">
                <FiCalendar className="mx-auto h-16 w-16 text-[#e9794d]" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-[#3e3c53] dark:text-[#e9deca]">
                Flip & Serve
              </h3>
              <p className="text-lg text-[#3e3c53] dark:text-[#e9deca]">
                Review the results, pick the best time, and serve up calendar invites to all
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Today Section */}
      <section className="bg-[#e9deca] py-20 dark:bg-[#2e2c43]">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-6xl text-[#3e3c53] dark:text-[#e9deca] md:text-8xl">
            PLAN TODAY
          </h2>
          <div className="mt-8">
            <Link
              href="/new-event"
              className="inline-block rounded-lg bg-[#e9794d] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-[#e9694d] hover:shadow-xl"
            >
              Start Planning
            </Link>
          </div>
          <div className="mt-12">
            <p className="text-sm text-[#3e3c53] dark:text-[#e9deca]">
              © 2025 plancake. Stacking up perfect plans, one pancake at a time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
