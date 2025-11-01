"use client";

import { useCallback, useState } from "react";

import {
  CheckIcon,
  CopyIcon,
  InfoCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import * as Toast from "@radix-ui/react-toast";

import BaseToast from "@/features/toast/base";
import ToastContext from "@/features/toast/context";
import { ToastData, ToastType } from "@/features/toast/type";

function getToastIcon(iconType: ToastType) {
  const iconClass = "col-start-1 row-span-2 h-5 w-5";

  switch (iconType) {
    case "error":
      return <ExclamationTriangleIcon className={iconClass} />;
    case "copy":
      return <CopyIcon className={iconClass} />;
    case "success":
      return <CheckIcon className={iconClass} />;
    default:
      return <InfoCircledIcon className={iconClass} />;
  }
}

function getToastStyle(type: ToastType) {
  switch (type) {
    case "error":
      return "bg-red";
    case "copy":
    case "success":
      return "bg-violet text-white dark:bg-white dark:text-violet";
    default:
      return "bg-blue";
  }
}

function getToastTitle(type: ToastType) {
  switch (type) {
    case "error":
      return "ERROR";
    case "copy":
      return "COPIED";
    case "success":
      return "SUCCESS";
    default:
      return "INFORMATION";
  }
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const data = {
      id: Date.now() + Math.random(),
      type,
      title: getToastTitle(type),
      message,
      open: true,
    };

    setToasts((prevToasts) => [...prevToasts, data]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) =>
      prevToasts.map((t) => (t.id === id ? { ...t, open: false } : t)),
    );

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, 400);
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
              open={toast.open}
              title={toast.title}
              message={toast.message}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  removeToast(toast.id);
                }
              }}
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
