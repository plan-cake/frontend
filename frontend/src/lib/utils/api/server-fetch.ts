import { getAuthCookieString } from "@/lib/utils/api/cookie-utils";
import { fetchJson } from "@/lib/utils/api/fetch-wrapper";
import { ApiEndpoints } from "@/lib/utils/api/types";

/**
 * Performs a GET request to the specified API endpoint from the server.
 * @param endpoint The endpoint to send the request to from the `ROUTES` object.
 * @param params An object with key-value pairs to be converted into query parameters.
 * @param options Optional fetch options to override defaults.
 * @returns A Promise that resolves to the Response object from the fetch call. 
 */
export async function serverGet<K extends keyof ApiEndpoints>(
  endpoint: K,
  params?: Record<string, string>,
  options?: RequestInit
): Promise<ApiEndpoints[K]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  let queryString = "";
  if (params && Object.keys(params).length > 0) {
    queryString = `?${new URLSearchParams(params).toString()}`;
  }

  const url = `${baseUrl}${endpoint}${queryString}`;

  const cookieString = await getAuthCookieString();

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieString,
    },
    ...options,
  };

  return (await fetchJson(url, requestOptions) as ApiEndpoints[K]);
}
