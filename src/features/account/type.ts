export type LoginState = "logged_in" | "logged_out" | "loading";

export type AccountDetails = {
  email: string;
  defaultName: string | null;
};
