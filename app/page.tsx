"use client";

import { useState } from "react";
import Link from "next/link";
import useDarkMode from "@/app/utils/useTheme";

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
		</div>
	);
}