import { createContext, useContext } from "react";

import { ToastType } from "@/features/system-feedback/type";

export const ToastContext = createContext<{
  addToast: (
    type: ToastType,
    message: string,
    options?: { isPersistent?: boolean },
  ) => number;
  removeToast: (id: number) => void;
}>({
  addToast: () => 0,
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
