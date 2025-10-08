"use client";

import { ThemeProvider } from "next-themes";
import { createContext, useState } from "react";

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
      <LoginContext value={{ loggedIn, setLoggedIn }}>{children}</LoginContext>
    </ThemeProvider>
  );
}
