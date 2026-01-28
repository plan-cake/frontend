"use client";

import { useState } from "react";

import AccountContext from "@/features/account/context";
import { AccountDetails } from "@/features/account/type";

export default function AccountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [details, setDetails] = useState<AccountDetails | null>(null);

  const isLoggedIn = details !== null;

  const login = (details: AccountDetails) => {
    setDetails(details);
    setIsLoading(false);
  };

  const logout = () => {
    setDetails(null);
    setIsLoading(false);
  };

  return (
    <AccountContext.Provider
      value={{ isLoading, isLoggedIn, details, login, logout }}
    >
      {children}
    </AccountContext.Provider>
  );
}
