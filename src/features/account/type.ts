export type LoginState = "logged_in" | "logged_out" | "loading";

export type AccountDetails = {
  email: string;
  default_name: string | null;
};
