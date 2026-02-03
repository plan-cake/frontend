"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import Loading from "@/app/loading";
import { useAccount } from "@/features/account/context";
import { useToast } from "@/features/system-feedback";
import { MESSAGES } from "@/lib/messages";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loginState } = useAccount();
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    if (loginState === "logged_in") {
      router.replace("/dashboard");
      addToast("info", MESSAGES.INFO_ALREADY_LOGGED_IN);
    }
  }, [loginState, router, addToast]);

  if (loginState === "loading" || loginState === "logged_in") {
    // Logged in status is included to avoid flickering on redirect
    return <Loading />;
  }

  return <>{children}</>;
}
