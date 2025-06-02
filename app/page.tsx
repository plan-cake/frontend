"use client";

import { useState } from "react";
import Link from "next/link";
import useDarkMode from "@/app/utils/useTheme";

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
	const { isDarkMode, toggleDarkMode } = useDarkMode();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<div
			className={`min-h-screen ${
				isDarkMode ? "bg-violet-800" : "bg-bone-50"
			} transition-colors duration-300`}
		>
			{/* Navigation */}
			<nav
				className={`${
					isDarkMode ? "bg-violet-700" : "bg-smoke-100"
				} shadow-sm border-b ${
					isDarkMode ? "border-violet-600" : "border-bone-200"
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<h1
								className={`text-2xl font-bold ${
									isDarkMode ? "text-bone-100" : "text-violet-700"
								}`}
							>
								🥞 plancake
							</h1>
						</div>

						<div className="hidden md:block">
							<div className="ml-10 flex items-baseline space-x-4">
								<Link
									href="/dashboard"
									className={`${
										isDarkMode
											? "text-bone-200 hover:text-bone-100"
											: "text-violet-600 hover:text-violet-700"
									} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
								>
									Dashboard
								</Link>
								<Link
									href="/newevent"
									className={`${
										isDarkMode
											? "text-bone-200 hover:text-bone-100"
											: "text-violet-600 hover:text-violet-700"
									} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
								>
									Create Event
								</Link>
								<button
									onClick={toggleDarkMode}
									className={`${
										isDarkMode
											? "text-bone-200 hover:text-bone-100"
											: "text-violet-600 hover:text-violet-700"
									} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
								>
									{isDarkMode ? "☀️" : "🌙"}
								</button>
							</div>
						</div>

						<div className="md:hidden">
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className={`${
									isDarkMode ? "text-bone-200" : "text-violet-600"
								} p-2`}
							>
								<svg
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>

				{mobileMenuOpen && (
					<div
						className={`md:hidden ${
							isDarkMode ? "bg-violet-700" : "bg-smoke-100"
						} border-t ${
							isDarkMode ? "border-violet-600" : "border-bone-200"
						}`}
					>
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
							<Link
								href="/dashboard"
								className={`${
									isDarkMode ? "text-bone-200" : "text-violet-600"
								} block px-3 py-2 text-base font-medium`}
							>
								Dashboard
							</Link>
							<Link
								href="/newevent"
								className={`${
									isDarkMode ? "text-bone-200" : "text-violet-600"
								} block px-3 py-2 text-base font-medium`}
							>
								Create Event
							</Link>
							<button
								onClick={toggleDarkMode}
								className={`${
									isDarkMode ? "text-bone-200" : "text-violet-600"
								} block px-3 py-2 text-base font-medium w-full text-left`}
							>
								{isDarkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
							</button>
						</div>
					</div>
				)}
			</nav>

			{/* Hero Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto text-center">
					<div className="mb-8">
						<span className="text-6xl mb-4 block">🥞</span>
					</div>
					<h1
						className={`text-5xl md:text-7xl font-bold ${
							isDarkMode ? "text-bone-100" : "text-violet-700"
						} mb-6`}
					>
						planning made
						<span className="block text-coral-500">stack simple</span>
					</h1>
					<p
						className={`text-xl md:text-2xl ${
							isDarkMode ? "text-bone-300" : "text-violet-600"
						} mb-8 max-w-3xl mx-auto`}
					>
						The fluffiest way to coordinate schedules and plan group events.
						Stack up availability and serve the perfect meeting time.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/newevent"
							className="bg-coral-500 hover:bg-coral-600 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
						>
							Mix Your First Plan
						</Link>
						<Link
							href="/dashboard"
							className={`${
								isDarkMode
									? "bg-blue-600 hover:bg-blue-500 text-bone-100"
									: "bg-blue-500 hover:bg-blue-600 text-white"
							} font-semibold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl`}
						>
							View Dashboard
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				className={`py-20 ${isDarkMode ? "bg-violet-700" : "bg-white"}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2
							className={`text-4xl font-bold ${
								isDarkMode ? "text-bone-100" : "text-violet-700"
							} mb-4`}
						>
							Why Choose plancake?
						</h2>
						<p
							className={`text-xl ${
								isDarkMode ? "text-bone-300" : "text-violet-600"
							} max-w-2xl mx-auto`}
						>
							Fluffy, simple planning that stacks up perfectly. No more burnt
							schedules or half-baked meetings.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className={`${
									isDarkMode ? "bg-violet-600" : "bg-bone-100"
								} p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border ${
									isDarkMode ? "border-violet-500" : "border-bone-200"
								}`}
							>
								<div className="text-4xl mb-4">{feature.icon}</div>
								<h3
									className={`text-2xl font-semibold ${
										isDarkMode ? "text-bone-100" : "text-violet-700"
									} mb-4`}
								>
									{feature.title}
								</h3>
								<p
									className={`${
										isDarkMode ? "text-bone-300" : "text-violet-600"
									} text-lg`}
								>
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2
							className={`text-4xl font-bold ${
								isDarkMode ? "text-bone-100" : "text-violet-700"
							} mb-4`}
						>
							Golden Stack Recipe
						</h2>
						<p
							className={`text-xl ${
								isDarkMode ? "text-bone-300" : "text-violet-600"
							} max-w-2xl mx-auto`}
						>
							Follow these simple steps to cook up the perfect schedule every
							time.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{steps.map((step, index) => (
							<div key={index} className="text-center">
								<div
									className={`w-16 h-16 ${
										isDarkMode ? "bg-lion-600" : "bg-lion-500"
									} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg`}
								>
									{step.step}
								</div>
								<h3
									className={`text-2xl font-semibold ${
										isDarkMode ? "text-bone-100" : "text-violet-700"
									} mb-4`}
								>
									{step.title}
								</h3>
								<p
									className={`${
										isDarkMode ? "text-bone-300" : "text-violet-600"
									} text-lg`}
								>
									{step.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section
				className={`py-20 ${
					isDarkMode ? "bg-violet-700" : "bg-coral-50"
				}`}
			>
				<div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
					<div className="mb-6">
						<span className="text-5xl">🥞</span>
					</div>
					<h2
						className={`text-4xl font-bold ${
							isDarkMode ? "text-bone-100" : "text-violet-700"
						} mb-6`}
					>
						Ready to Stack Up Success?
					</h2>
					<p
						className={`text-xl ${
							isDarkMode ? "text-bone-300" : "text-violet-600"
						} mb-8`}
					>
						Join teams worldwide who discovered the fluffiest way to plan
						together.
					</p>
					<Link
						href="/newevent"
						className="bg-coral-500 hover:bg-coral-600 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl inline-block"
					>
						Start Cooking Today 🥞
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer
				className={`${
					isDarkMode ? "bg-violet-800" : "bg-bone-100"
				} ${isDarkMode ? "border-violet-600" : "border-bone-200"} border-t`}
			>
				<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h3
							className={`text-2xl font-bold ${
								isDarkMode ? "text-bone-100" : "text-violet-700"
							} mb-4`}
						>
							🥞 plancake
						</h3>
						<p
							className={`${
								isDarkMode ? "text-bone-400" : "text-violet-500"
							}`}
						>
							© 2025 plancake. Stacking up perfect plans, one pancake at a
							time.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}