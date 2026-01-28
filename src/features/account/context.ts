import { createContext, useContext } from "react";

import { AccountDetails } from "@/features/account/type";

export const AccountContext = createContext<{
  isLoading: boolean;
  isLoggedIn: boolean;
  details: AccountDetails | null;
  login: (details: AccountDetails) => void;
  logout: () => void;
}>({
  isLoading: true,
  isLoggedIn: false,
  details: null,
  login: () => { },
  logout: () => { },
});

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}

export default AccountContext;
