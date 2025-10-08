"use client";

import { useEffect, useState } from "react";
import { PersonIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import AccountDropdown from "./account-dropdown";
import Link from "next/link";

export default function AccountButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
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
  }, []);

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
        className="cursor-pointer rounded-full bg-red p-2 px-4 py-2 font-medium"
        href="/login"
        aria-label="Log in"
      >
        Log In
      </Link>
    );
  }
}
