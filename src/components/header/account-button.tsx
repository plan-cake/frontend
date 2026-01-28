"use client";

import { useEffect } from "react";

import { PersonIcon } from "@radix-ui/react-icons";

import AccountDropdown from "@/components/header/account-dropdown";
import { useAccount } from "@/features/account/context";
import ActionButton from "@/features/button/components/action";
import LinkButton from "@/features/button/components/link";

export default function AccountButton() {
  const { isLoading, isLoggedIn, login, logout } = useAccount();

  useEffect(() => {
    const checkLogin = async () => {
      if (isLoggedIn) return;

      try {
        const res = await fetch("/api/auth/check-account-auth/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          login(await res.json());
        } else {
          logout();
        }
      } catch (err) {
        console.error("Fetch error:", err);
        logout();
      }
    };
    checkLogin();
  }, [isLoggedIn, login, logout]);

  if (isLoggedIn) {
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
      <LinkButton
        buttonStyle="frosted glass"
        label="Log In"
        href="/login"
        loading={isLoading}
      />
    );
  }
}
