import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export function formatAuthCookies(cookies: ReadonlyRequestCookies): string {
  if (!cookies) return "";
  let cookieHeader = "";
  const authCookieNames = ["auth_sess_token", "guest_sess_token"];
  authCookieNames.forEach((name) => {
    const cookie = cookies.get(name);
    if (cookie) {
      cookieHeader += `${name}=${cookie.value}; `;
    }
  });
  return cookieHeader.trim();
}
