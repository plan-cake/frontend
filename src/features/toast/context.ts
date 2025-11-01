import { createContext, useContext } from "react";

import { ToastType } from "@/features/toast/type";

export const ToastContext = createContext<{
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: number) => void;
}>({
  addToast: () => {},
  removeToast: () => {},
});

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export default ToastContext;
