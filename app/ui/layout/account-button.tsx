"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { PersonIcon } from "@radix-ui/react-icons";

export default function AccountButton() {
  const loggedIn = useRef(false);
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/auth/check-account-auth/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          loggedIn.current = true;
        } else {
          loggedIn.current = false;
        }
      } catch (err) {
        console.error("Fetch error:", err);
        loggedIn.current = false;
      }
      setCheckingLogin(false);
    };
    checkLogin();
  }, []);

  if (checkingLogin) {
    return (
      <div className="flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-sm transition-all duration-300">
        <div className="h-5 w-5 animate-pulse rounded bg-gray-300" />
      </div>
    );
  }

  if (loggedIn.current) {
    return (
      <button
        type="button"
        // onClick={toggleTheme}
        className="flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
        aria-label="Account"
      >
        <PersonIcon className="h-5 w-5" />
      </button>
    );
  } else {
    return (
      <Link
        href="/login"
        className="ml-auto cursor-pointer gap-2 rounded-full bg-red px-4 py-2 font-medium transition"
        aria-label="Log in"
      >
        Log In
      </Link>
    );
  }
}
