"use client";

import * as Toast from "@radix-ui/react-toast";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Toast.Provider swipeDirection="right">
      {children}
      <Toast.Viewport className="fixed right-0 bottom-10 z-[2147483647] m-0 flex list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px] md:bottom-0" />
    </Toast.Provider>
  );
}
