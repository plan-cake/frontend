import { ReactNode } from "react";

export default function LinkText({ children }: { children: ReactNode }) {
  return (
    <span
      className={
        "hover:text-blue dark:hover:text-red cursor-pointer hover:underline"
      }
    >
      {children}
    </span>
  );
}
