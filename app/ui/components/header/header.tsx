"use client";

import { useEffect, useState } from "react";
import LogoArea from "@/app/ui/components/header/logo-area";
import AccountButton from "@/app/ui/components/header/account-button";
import ThemeToggle from "@/app/ui/components/header/theme-toggle";
import NewEventButton from "@/app/ui/components/header/new-event-button";
import DashboardButton from "@/app/ui/components/header/dashboard-button";

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="fixed top-0 z-40 h-25 w-full pt-4">
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
