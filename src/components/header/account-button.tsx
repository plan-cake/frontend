"use client";

import { useContext, useEffect, useState } from "react";

import { PersonIcon } from "@radix-ui/react-icons";

import AccountSettings from "@/features/account-settings/selector";
import ActionButton from "@/features/button/components/action";
import LinkButton from "@/features/button/components/link";
import { LoginContext } from "@/lib/providers";

export default function AccountButton() {
  const { loggedIn, setLoggedIn } = useContext(LoginContext);

  // 1. Check Login Status
  useEffect(() => {
    const checkLogin = async () => {
      if (loggedIn) return;
      try {
        const res = await fetch("/api/auth/check-account-auth/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        setLoggedIn(res.ok);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoggedIn(false);
      }
    };
    checkLogin();
  }, [loggedIn, setLoggedIn]);

  const [open, setOpen] = useState(false);
  const handleOpenChange = () => {
    setOpen(!open);
    return true;
  };

  if (loggedIn) {
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
    <LinkButton buttonStyle="frosted glass" label="Log In" href="/login" />
  );
}
