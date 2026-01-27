"use client";

import { useCallback, useState } from "react";

import * as Toast from "@radix-ui/react-toast";

import BaseToast from "@/features/system-feedback/toast/base";
import { TOAST_CONFIG } from "@/features/system-feedback/toast/config";
import ToastContext from "@/features/system-feedback/toast/context";
import { ToastData, ToastOptions } from "@/features/system-feedback/toast/type";
import { ToastType } from "@/features/system-feedback/type";
import { cn } from "@/lib/utils/classname";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [isHoveringToast, setIsHoveringToast] = useState(false);

  const addToast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      // check the local storage key to see if we should show the toast
      // if the key exists, do not show the toast and return -1 as the id
      if (options?.localStorageKey) {
        if (
          typeof window !== "undefined" &&
          window.localStorage.getItem(options.localStorageKey)
        ) {
          return -1;
        }
      }

      const id = Date.now() + Math.random();

      // handle onDismiss to set local storage key if provided
      // and call the original onDismiss if provided
      const handleDismiss = () => {
        if (options?.localStorageKey && typeof window !== "undefined") {
          window.localStorage.setItem(options.localStorageKey, "true");
        }
        options?.onDismiss?.();
      };

      // create new toast data
      const newToast: ToastData = {
        id,
        type,
        message,
        open: true,
        title: options?.title ?? TOAST_CONFIG[type].title,
        isPersistent: options?.isPersistent ?? false,
        onDismiss: handleDismiss,
        duration: options?.duration,
        localStorageKey: options?.localStorageKey,
      };

      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    if (id === -1) return;

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

        <Toast.Viewport
          className={cn(
            "fixed bottom-12 right-0 z-[2147483647] md:bottom-0",
            "flex list-none flex-col items-end outline-none",
            "m-0 space-y-1 p-[var(--viewport-padding)] [--viewport-padding:_25px]",
          )}
        >
          {toasts.map((toast) => {
            const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
            const Icon = config.icon;

            return (
              <div
                key={toast.id}
                onMouseEnter={() => setIsHoveringToast(true)}
                onMouseLeave={() => setIsHoveringToast(false)}
              >
                <BaseToast
                  open={toast.open}
                  backgroundColor={config.background}
                  textColor={config.textColor}
                  title={toast.title}
                  message={toast.message}
                  icon={<Icon className="col-start-1 row-span-2 h-5 w-5" />}
                  isPersistent={toast.isPersistent}
                  duration={toast.duration}
                  isPaused={isHoveringToast}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) {
                      if (toast.onDismiss) {
                        toast.onDismiss();
                      }
                      removeToast(toast.id);
                    }
                  }}
                />
              </div>
            );
          })}
        </Toast.Viewport>
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
