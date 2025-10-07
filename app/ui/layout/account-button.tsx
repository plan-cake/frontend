"use client";

import { useEffect, useState } from "react";
import { PersonIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

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

  return (
    <button
      className={
        "cursor-pointer rounded-full p-2 font-medium " +
        (loggedIn
          ? "frosted-glass flex items-center justify-center"
          : "bg-red px-4 py-2")
      }
      onClick={() => {
        if (loggedIn) {
          // open account menu
        } else {
          router.push("/login");
        }
      }}
      aria-label={loggedIn ? "Open account menu" : "Log in"}
    >
      {loggedIn ? <PersonIcon className="h-5 w-5" /> : "Log In"}
    </button>
  );
}
