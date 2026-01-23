import { ToastType } from "@/features/system-feedback/type";

export type ToastData = {
  id: number;
  type: ToastType;
  title: string;
  message: string;
  open: boolean;
  isPersistent: boolean;
};

export interface ToastErrorMessage {
  id: number;
  message: string;
}
