"use client";

import { useEffect, useState } from "react";
import LogoArea from "./logo-area";
import AccountButton from "./account-button";
import ThemeToggle from "./theme-toggle";
import NewEventButton from "./new-event-button";
import DashboardButton from "./dashboard-button";

import Link from "next/link";
import Logo from "../logo";

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="max-w-[1440px] p-4">
      <nav className="flex w-full items-center justify-between">
        <LogoArea />

        <div className="frosted-glass flex h-fit items-center gap-2 rounded-full p-2">
          <NewEventButton />
          <ThemeToggle />
          <DashboardButton />
          <AccountButton />
        </div>
      </nav>
    </header>
  );
}
