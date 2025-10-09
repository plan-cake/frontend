import Image from "next/image";
import ToggleDarkMode from "./theme-toggle";
export default function Header() {
  return (
    <div className="grid w-full grid-cols-3 items-center">
      <div className="relative col-start-2 h-[75px] w-[100px] md:col-start-1">
        <Image
          src="/plancake-light.png"
          alt="Plancake Logo"
          fill
          className="absolute inset-0 object-contain opacity-100 transition-opacity duration-500 dark:opacity-0"
        />
        <Image
          src="/plancake-dark.png"
          alt="Plancake Logo"
          fill
          className="absolute inset-0 object-contain opacity-0 transition-opacity duration-500 dark:opacity-100"
        />
      </div>
      <div className="col-start-3 inline-flex justify-end">
        <ToggleDarkMode />
      </div>
    </div>
  );
}
