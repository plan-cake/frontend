import Link from "next/link";
import Logo from "../components/logo";
import ThemeToggle from "./theme-toggle";

export default function Header() {
  return (
    <>
      <nav className="absolute left-0 right-0 top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-start justify-between px-4">
          <Link href="/" className="block">
            <Logo />
          </Link>
        </div>
      </nav>
      
      {/* Fixed theme toggle */}
      <ThemeToggle />
    </>
  );
}