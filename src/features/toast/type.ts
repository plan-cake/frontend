export type ToastData = {
  id: number;
  type: string;
  title: string;
  message: string;
  open: boolean;
};

export interface ToastErrorMessage {
  id: number;
  message: string;
}
