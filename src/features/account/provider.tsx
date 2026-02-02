"use client";

import { useCallback, useState } from "react";

import AccountContext from "@/features/account/context";
import { AccountDetails, LoginState } from "@/features/account/type";

export default function AccountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loginState, setLoginState] = useState<LoginState>("loading");
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null,
  );

  const login = useCallback((accountDetails: AccountDetails) => {
    setAccountDetails(accountDetails);
    setLoginState("logged_in");
  }, []);

  const logout = useCallback(() => {
    setAccountDetails(null);
    setLoginState("logged_out");
  }, []);

  return (
    <AccountContext.Provider
      value={{ loginState, accountDetails, login, logout }}
    >
      {children}
    </AccountContext.Provider>
  );
}
