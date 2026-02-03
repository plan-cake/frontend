"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import Loading from "@/app/loading";
import { useAccount } from "@/features/account/context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loginState } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (loginState === "logged_in") {
      router.replace("/dashboard");
    }
  }, [loginState, router]);

  if (loginState === "loading" || loginState === "logged_in") {
    // Logged in status is included to avoid flickering on redirect
    return <Loading />;
  }

  return <>{children}</>;
}
