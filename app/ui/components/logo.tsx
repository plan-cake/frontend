"use client";

import { useEffect, useState } from "react";
import HamburgerMenu from "./hamburger-menu";

export default function Logo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Background shape */}
      <div className="h-20 w-28 rounded-br-[60px] bg-lion shadow-lg" />

      {/* Text Container */}
      <div className="absolute top-2 left-2">
        <div className="font-display text-2xl leading-[20px] font-normal text-lion [-webkit-text-stroke:1px_white]">
          plan
        </div>
        <div className="font-display text-2xl leading-[20px] font-normal text-lion [-webkit-text-stroke:1px_black]">
          cake
        </div>

        {/* Menu icon */}
        <nav className="flex w-full items-center justify-between">
          <HamburgerMenu />
        </nav>
      </div>
    </div>
  );
}
