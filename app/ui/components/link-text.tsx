import { ReactNode } from "react";

export default function LinkText({ children }: { children: ReactNode }) {
  return (
    <span
      className={
        "cursor-pointer hover:text-blue hover:underline dark:hover:text-red"
      }
    >
      {children}
    </span>
  );
}
