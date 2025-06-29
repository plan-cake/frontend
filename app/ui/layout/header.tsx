import Link from "next/link";
import ToggleDarkMode from "./theme-toggle";
import Logo from "../components/logo";

export default function Header() {
  return (
    <nav className="absolute left-0 right-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-start justify-between px-4">
        <Link href="/" className="block">
          <Logo />
        </Link>
        <div className="flex items-center pt-4">
          <button 
            className="rounded-full p-2 text-bone hover:bg-bone/10"
            aria-label="Toggle theme"
          >
            <ToggleDarkMode />
          </button>
        </div>
      </div>
    </nav>
  );
}
