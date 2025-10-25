"use client";

import { useEffect, useState } from "react";
import LogoArea from "@/src/components/header/logo-area";
import AccountButton from "@/src/components/header/account-button";
import ThemeToggle from "@/src/components/header/theme-toggle";
import NewEventButton from "@/src/components/header/new-event-button";
import DashboardButton from "@/src/components/header/dashboard-button";

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="h-25 fixed top-0 z-40 w-full pt-4">
      <nav className="flex w-full max-w-[1440px] justify-between px-4">
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
