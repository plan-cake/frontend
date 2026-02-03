"use client";

import { useEffect, useState } from "react";

import { PersonIcon } from "@radix-ui/react-icons";

import { useAccount } from "@/features/account/context";
import AccountSettings from "@/features/account-settings/selector";
import ActionButton from "@/features/button/components/action";
import LinkButton from "@/features/button/components/link";

export default function AccountButton() {
  const { loginState, login, logout } = useAccount();

  // 1. Check Login Status
  useEffect(() => {
    const checkLogin = async () => {
      if (loginState === "logged_in") return;

      try {
        const res = await fetch("/api/auth/check-account-auth/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          login({
            email: data.email,
            defaultName: data.default_display_name,
          });
        } else {
          logout();
        }
      } catch (err) {
        console.error("Fetch error:", err);
        logout();
      }
    };
    checkLogin();
  }, [loginState, login, logout]);

  const [open, setOpen] = useState(false);
  const handleOpenChange = () => {
    setOpen(!open);
    return true;
  };

  if (loginState === "logged_in") {
    return (
      <AccountSettings open={open} setOpenChange={setOpen}>
        <ActionButton
          buttonStyle="frosted glass"
          icon={<PersonIcon />}
          onClick={handleOpenChange}
        />
      </AccountSettings>
    );
  }

  return (
    <LinkButton
      buttonStyle="frosted glass"
      label="Log In"
      href="/login"
      loading={loginState === "loading"}
    />
  );
}
