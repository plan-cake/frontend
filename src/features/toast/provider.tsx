"use client";

import { useCallback, useState } from "react";

import { CheckIcon } from "@radix-ui/react-icons";
import * as Toast from "@radix-ui/react-toast";

import ErrorToast from "@/features/toast/components/error";
import SuccessToast from "@/features/toast/components/success";
import ToastContext, { ToastData } from "@/features/toast/context";

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

        <Toast.Viewport className="fixed bottom-10 right-0 z-[2147483647] m-0 flex list-none flex-col items-end gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px] md:bottom-0" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
