"use client";

import { useEffect, useState } from "react";
import HamburgerMenu from "./hamburger-menu";
import Link from "next/link";
import Logo from "../logo";

export default function LogoArea() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="frosted-glass fixed top-4 left-4 z-50 h-20 w-28 rounded-br-[60px]">
      {/* Text Container */}
      <div className="p-2">
        <Link href="/">
          <Logo />
        </Link>
        <HamburgerMenu />
      </div>
    </div>
  );
}
