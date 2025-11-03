"use client";

import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

import ActionButton from "@/features/button/components/action";

export default function FixedThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    return true;
  };

  return (
    <ActionButton
      buttonStyle="frosted glass"
      icon={resolvedTheme === "dark" ? <FiMoon /> : <FiSun />}
      onClick={toggleTheme}
    />
  );
}
