"use client";

import { useCallback, useState } from "react";

import {
  CheckIcon,
  CopyIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import * as Toast from "@radix-ui/react-toast";

import BaseToast from "@/features/toast/components/base";
import ToastContext from "@/features/toast/context";
import { ToastData } from "@/features/toast/type";

function getToastIcon(iconType: string) {
  const iconClass = "col-start-1 row-span-2 h-5 w-5";

  switch (iconType) {
    case "error":
      return <ExclamationTriangleIcon className={iconClass} />;
    case "copy":
      return <CopyIcon className={iconClass} />;
    case "success":
    default:
      return <CheckIcon className={iconClass} />;
  }
}

function getToastStyle(type: string) {
  switch (type) {
    case "error":
      return "border-red bg-red border dark:border-red-400";
    case "success":
    default:
      return "border-lion bg-lion border";
  }
}

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
          const toastIcon = getToastIcon(toast.type);
          const toastStyle = getToastStyle(toast.type);

          return (
            <BaseToast
              key={toast.id}
              open={true}
              title={toast.title}
              message={toast.message}
              onOpenChange={(isOpen) => !isOpen && removeToast(toast.id)}
              icon={toastIcon}
              toastStyle={toastStyle}
            />
          );
        })}

        <Toast.Viewport className="fixed bottom-10 right-0 z-[2147483647] m-0 flex list-none flex-col items-end gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px] md:bottom-0" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
