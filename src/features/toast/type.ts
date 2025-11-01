export type ToastType = "error" | "copy" | "success" | "info";

export type ToastData = {
  id: number;
  type: ToastType;
  title: string;
  message: string;
  open: boolean;
};

export interface ToastErrorMessage {
  id: number;
  message: string;
}
