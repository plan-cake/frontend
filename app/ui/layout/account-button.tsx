"use client";

import { useEffect, useRef } from "react";
import { PersonIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function AccountButton() {
  const loggedIn = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // // TODO: make this at least check if the cookie exists first to avoid hitting the API every time
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
    };
    checkLogin();
  }, []);

  return (
    <button
      className={
        loggedIn.current
          ? "frosted-glass flex items-center justify-center rounded-full p-2 hover:bg-white/20"
          : "cursor-pointer rounded-full bg-red px-4 py-2 font-medium"
      }
      onClick={() => {
        if (loggedIn.current) {
          // open account menu
        } else {
          router.push("/login");
        }
      }}
      aria-label={loggedIn.current ? "Open account menu" : "Log in"}
    >
      {loggedIn.current ? (
        <PersonIcon className="h-5 w-5 text-violet dark:text-yellow-400" />
      ) : (
        "Log In"
      )}
    </button>
  );
}
