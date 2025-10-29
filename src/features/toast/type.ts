export type ToastData = {
  id: number;
  type: string;
  title: string;
  message: string;
};

export interface ToastErrorMessage {
  id: number;
  message: string;
}
