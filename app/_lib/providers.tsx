"use client";

import { ThemeProvider } from "next-themes";
import { createContext, useState } from "react";
import ToastProvider from "../ui/components/toast-provider";

export const LoginContext = createContext<{
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}>({
  loggedIn: false,
  setLoggedIn: () => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
        <ToastProvider>{children}</ToastProvider>
      </LoginContext.Provider>
    </ThemeProvider>
  );
}
