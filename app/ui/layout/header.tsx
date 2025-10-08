import Logo from "../components/logo";
import ThemeToggle from "./theme-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-100 w-full">
      <nav>
        <Logo />
      </nav>

      <ThemeToggle />
    </header>
  );
}
