import Image from "next/image";
import ToggleDarkMode from "./theme-toggle";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="absolute left-0 right-0 top-0 z-50 p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="relative h-[50px] w-[75px]">
          <Image
            src="/tomeeto-light.png"
            alt="Plancake Logo"
            fill
            className="absolute inset-0 object-contain opacity-100 transition-opacity duration-500 dark:opacity-0"
          />
          <Image
            src="/tomeeto-dark.png"
            alt="Plancake Logo"
            fill
            className="absolute inset-0 object-contain opacity-0 transition-opacity duration-500 dark:opacity-100"
          />
        </Link>
        <div className="flex items-center">
          <button 
            className="rounded-full p-2 text-[#3e3c53] hover:bg-[#e9deca]/10 dark:text-[#e9deca]"
            aria-label="Toggle theme"
          >
            <ToggleDarkMode />
          </button>
        </div>
      </div>
    </nav>
  );
}
