"use client";

import { useCallback, useState } from "react";

import * as Toast from "@radix-ui/react-toast";

import BaseToast from "@/features/system-feedback/toast/base";
import { TOAST_CONFIG } from "@/features/system-feedback/toast/config";
import ToastContext from "@/features/system-feedback/toast/context";
import { ToastData } from "@/features/system-feedback/toast/type";
import { ToastType } from "@/features/system-feedback/type";
import { cn } from "@/lib/utils/classname";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (
      type: ToastType,
      message: string,
      options?: { title?: string; isPersistent?: boolean },
    ) => {
      const data = {
        id: Date.now() + Math.random(),
        type,
        title: options?.title ?? TOAST_CONFIG[type].title,
        message,
        open: true,
        isPersistent: options?.isPersistent ?? false,
      };

      setToasts((prevToasts) => [...prevToasts, data]);
      return data.id;
    },
    [],
  );

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
          const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
          const Icon = config.icon;

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
              icon={<Icon className="col-start-1 row-span-2 h-5 w-5" />}
              backgroundColor={config.background}
              textColor={config.textColor}
              isPersistent={toast.isPersistent}
            />
          );
        })}

        <Toast.Viewport
          className={cn(
            "fixed bottom-12 right-0 z-[2147483647] md:bottom-0",
            "flex list-none flex-col items-end outline-none",
            "m-0 gap-2.5 p-[var(--viewport-padding)] [--viewport-padding:_25px]",
          )}
        />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
