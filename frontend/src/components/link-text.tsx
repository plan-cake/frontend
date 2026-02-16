import { ReactNode } from "react";

export default function LinkText({ children }: { children: ReactNode }) {
  return (
    <span className={"hover:text-accent cursor-pointer hover:underline"}>
      {children}
    </span>
  );
}
