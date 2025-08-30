"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function FixedThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
          <div className="h-5 w-5 animate-pulse rounded bg-gray-300" />
        </div>
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-violet backdrop-blur-sm transition-all duration-300 hover:bg-white/20 dark:text-bone"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? (
        <FiSun size={20} className="text-yellow-400" />
      ) : (
        <FiMoon size={20} className="text-violet" />
      )}
    </button>
  );
}
