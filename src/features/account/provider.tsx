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
  const [details, setDetails] = useState<AccountDetails | null>(null);

  const login = useCallback((details: AccountDetails) => {
    setDetails(details);
    setLoginState("logged_in");
  }, []);

  const logout = useCallback(() => {
    setDetails(null);
    setLoginState("logged_out");
  }, []);

  return (
    <AccountContext.Provider value={{ loginState, details, login, logout }}>
      {children}
    </AccountContext.Provider>
  );
}
