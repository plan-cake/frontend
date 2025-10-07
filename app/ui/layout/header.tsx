import Link from "next/link";
import Logo from "../components/logo";
import ThemeToggle from "./theme-toggle";
import AccountButton from "./account-button";
import { cn } from "@/app/_lib/classname";

export default function Header() {
  return (
    <>
      <nav className="absolute top-0 right-0 left-0 z-40">
        <div className="mx-auto flex max-w-7xl items-start justify-between px-4">
          <Logo />
        </div>
      </nav>

      {/* Theme and account buttons */}
      <div className="frosted-glass fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full p-2">
        <ThemeToggle />
        <AccountButton />
      </div>
    </>
  );
}
