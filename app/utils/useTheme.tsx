import { useState, useEffect, useCallback } from "react";

export default function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const dark = savedTheme ? savedTheme === "dark" : prefersDark;

    setIsDarkMode(dark);
    setIsClientReady(true);

    const html = document.documentElement;
    html.classList.toggle("dark", dark);
  }, []);

  const toggleDarkMode = useCallback(() => {
    if (isDarkMode === null) return;

    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    const html = document.documentElement;

    if (newMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return {
    isDarkMode: isDarkMode ?? false,
    isClientReady,
    toggleDarkMode,
  };
}
