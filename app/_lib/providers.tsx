"use client";

import { ThemeProvider } from "next-themes";
import { createContext, useState } from "react";
import ToastProvider from "./toast-provider";

export const LoginContext = createContext<{
  loggedIn: boolean | null;
  setLoggedIn: (loggedIn: boolean) => void;
}>({
  loggedIn: null,
  setLoggedIn: () => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
        <ToastProvider>{children}</ToastProvider>
      </LoginContext.Provider>
    </ThemeProvider>
  );
}
