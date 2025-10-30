export type ToastData = {
  id: number;
  type: "error" | "copy" | "success" | "info";
  title: string;
  message: string;
  open: boolean;
};

export interface ToastErrorMessage {
  id: number;
  message: string;
}
