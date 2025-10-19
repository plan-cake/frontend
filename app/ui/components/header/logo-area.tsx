"use client";

import { useEffect, useState } from "react";
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
    <div>
      {/* Text Container */}
      <Link href="/">
        <Logo />
      </Link>
      <span className="text-xs">v0.1.0</span>
    </div>
  );
}
