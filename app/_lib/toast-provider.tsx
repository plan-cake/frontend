"use client";

import { useCallback, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import ToastContext, { ToastData } from "@/app/_lib/toast-context";
import ErrorToast from "@/app/ui/components/toasts/error-toast";
import SuccessToast from "@/app/ui/components/toasts/success-toast";
import { CheckIcon } from "@radix-ui/react-icons";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((data: ToastData) => {
    setToasts((prevToasts) => [...prevToasts, data]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <Toast.Provider swipeDirection="right">
        {children}

        {toasts.map((toast) => {
          if (toast.type === "error") {
            return (
              <ErrorToast
                key={toast.id}
                open={true}
                label={toast.title}
                error={toast.message}
                onOpenChange={(isOpen) => !isOpen && removeToast(toast.id)}
              />
            );
          } else if (toast.type === "success") {
            return (
              <SuccessToast
                key={toast.id}
                open={true}
                title={toast.title}
                message={toast.message}
                onOpenChange={(isOpen) => !isOpen && removeToast(toast.id)}
                icon={
                  toast.icon ? (
                    toast.icon
                  ) : (
                    <CheckIcon className="col-start-1 row-span-2 h-5 w-5" />
                  )
                }
              />
            );
          }

          return null;
        })}

        <Toast.Viewport className="fixed right-0 bottom-10 z-[2147483647] m-0 flex list-none flex-col items-end gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px] md:bottom-0" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
