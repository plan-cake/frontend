import { ToastType } from "@/features/system-feedback/type";

export type ToastOptions = {
  title?: string;
  duration?: number;
  isPersistent?: boolean;
  onDismiss?: () => void;
};

export type ToastData = ToastOptions & {
  id: number;
  type: ToastType;
  message: string;
  open: boolean;
};

export interface ToastErrorMessage {
  id: number;
  message: string;
}
