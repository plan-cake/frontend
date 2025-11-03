"use client";

import { useContext, useEffect } from "react";

import { PersonIcon } from "@radix-ui/react-icons";

import AccountDropdown from "@/components/header/account-dropdown";
import ActionButton from "@/features/button/components/action";
import LinkButton from "@/features/button/components/link";
import { LoginContext } from "@/lib/providers";

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
        <ActionButton
          buttonStyle="frosted glass"
          icon={<PersonIcon />}
          onClick={() => true}
        />
      </AccountDropdown>
    );
  } else {
    return (
      <LinkButton buttonStyle="frosted glass" label="Log In" href="/login" />
    );
  }
}
