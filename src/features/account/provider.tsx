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

  return (
    <AccountContext.Provider
      value={{ isLoading, setIsLoading, details, setDetails }}
    >
      {children}
    </AccountContext.Provider>
  );
}
