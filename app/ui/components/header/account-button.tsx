"use client";

import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { LoginContext } from "@/app/_lib/providers";
import AccountDropdown from "./account-dropdown";

export default function AccountButton() {
  const { loggedIn, setLoggedIn } = useContext(LoginContext);

  useEffect(() => {
    const checkLogin = async () => {
      if (loggedIn) return;

      try {
        const res = await fetch("/api/auth/check-account-auth/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setLoggedIn(false);
      }
    };
    checkLogin();
  }, [loggedIn, setLoggedIn]);

  if (loggedIn) {
    return (
      <AccountDropdown>
        <button
          className="frosted-glass flex cursor-pointer items-center justify-center rounded-full p-2 font-medium"
          aria-label="Open account menu"
        >
          <PersonIcon className="h-5 w-5" />
        </button>
      </AccountDropdown>
    );
  } else {
    return (
      <Link
        className="frosted-glass cursor-pointer rounded-full px-4 py-1.5 font-medium text-nowrap"
        href="/login"
        aria-label="Log in"
      >
        Log In
      </Link>
    );
  }
}
