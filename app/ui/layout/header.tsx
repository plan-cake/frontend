import Link from "next/link";
import Logo from "../components/logo";
import ThemeToggle from "./theme-toggle";
import AccountButton from "./account-button";

export default function Header() {
  return (
    <>
      <nav className="absolute top-0 right-0 left-0 z-40">
        <div className="mx-auto flex max-w-7xl items-start justify-between px-4">
          <Logo />
        </div>
      </nav>

      {/* Theme and account buttons */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-sm">
        <ThemeToggle />
        <AccountButton />
      </div>
    </>
  );
}
