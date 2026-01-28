import { createContext, useContext } from "react";

import { AccountDetails } from "@/features/account/type";

export const AccountContext = createContext<{
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  details: AccountDetails | null;
  setDetails: (details: AccountDetails | null) => void;
}>({
  isLoading: true,
  setIsLoading: () => { },
  details: null,
  setDetails: () => { },
});

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}

export default AccountContext;
