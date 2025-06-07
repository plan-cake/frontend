import Link from "next/link";

const features = [
  {
    title: "Smart Planning",
    description:
      "Intelligently suggest optimal meeting times based on everyone's availability and preferences.",
    icon: "🧠",
  },
  {
    title: "Easy Polling",
    description:
      "Create polls for time slots and let participants vote on their preferences with visual feedback.",
    icon: "📊",
  },
  {
    title: "Seamless Sharing",
    description:
      "Share a simple link to collect availability from unlimited participants across time zones.",
    icon: "🌍",
  },
];

const steps = [
  {
    step: "01",
    title: "Mix Your Event",
    description:
      "Set up your meeting details, add time options, and customize your preferences",
  },
  {
    step: "02",
    title: "Share & Stack",
    description:
      "Send the link to participants and watch responses stack up in real-time",
  },
  {
    step: "03",
    title: "Flip & Serve",
    description:
      "Review the results, pick the best time, and serve up calendar invites to all",
  },
];

export default function Home() {
  return (
    <div className={`bg-bone-50 min-h-screen transition-colors duration-300`}>
      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-8">
            <span className="mb-4 block text-6xl">🥞</span>
          </div>
          <h1 className={`mb-6 text-5xl font-bold md:text-7xl`}>
            planning made
            <span className="block text-red">stack simple</span>
          </h1>
          <p className={`mx-auto mb-8 max-w-3xl text-xl md:text-2xl`}>
            The fluffiest way to coordinate schedules and plan group events.
            Stack up availability and serve the perfect meeting time.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/newevent"
              className="rounded-lg bg-red-400 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-red hover:shadow-xl dark:hover:bg-red-500"
            >
              Mix Your First Plan
            </Link>
            <Link
              href="/dashboard"
              className={`rounded-lg bg-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-blue-400 hover:shadow-xl dark:hover:bg-blue-600`}
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`bg-bone py-20 dark:bg-violet-700`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className={`mb-4 text-4xl font-bold`}>Why Choose plancake?</h2>
            <p className={`mx-auto max-w-2xl text-xl`}>
              Fluffy, simple planning that stacks up perfectly. No more burnt
              schedules or half-baked meetings.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-violet-600`}
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className={`mb-4 text-2xl font-semibold`}>
                  {feature.title}
                </h3>
                <p className={`text-lg`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className={`mb-4 text-4xl font-bold`}>Golden Stack Recipe</h2>
            <p className={`mx-auto max-w-2xl text-xl`}>
              Follow these simple steps to cook up the perfect schedule every
              time.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div
                  className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lion-500 text-2xl font-bold text-white shadow-lg dark:bg-lion-600`}
                >
                  {step.step}
                </div>
                <h3 className={`mb-4 text-2xl font-semibold`}>{step.title}</h3>
                <p className={`text-lg`}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`bg-bone py-20 dark:bg-violet-700`}>
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="text-5xl">🥞</span>
          </div>
          <h2 className={`mb-6 text-4xl font-bold`}>
            Ready to Stack Up Success?
          </h2>
          <p className={`mb-8 text-xl`}>
            Join teams worldwide who discovered the fluffiest way to plan
            together.
          </p>
          <Link
            href="/newevent"
            className="inline-block rounded-lg bg-red px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-red-400 hover:shadow-xl"
          >
            Start Cooking Today 🥞
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className={`mb-4 text-2xl font-bold`}>🥞 plancake</h3>
            <p>
              © 2025 plancake. Stacking up perfect plans, one pancake at a
              time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
