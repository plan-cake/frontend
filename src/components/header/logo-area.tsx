"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import LinkText from "@/components/link-text";
import Logo from "@/components/logo";

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
      <Link href="/version-history" className="text-xs">
        <LinkText>v0.1.2</LinkText>
      </Link>
    </div>
  );
}
