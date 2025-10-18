import { cookies } from "next/headers";

export async function getAuthCookieString(): Promise<string> {
  const cookieStore = await cookies();
  let cookieHeader = "";
  const authCookieNames = ["account_sess_token", "guest_sess_token"];
  authCookieNames.forEach((name) => {
    const cookie = cookieStore.get(name);
    if (cookie) {
      cookieHeader += `${name}=${cookie.value}; `;
    }
  });
  return cookieHeader.trim();
}
