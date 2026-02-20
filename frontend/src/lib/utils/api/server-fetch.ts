import { getAuthCookieString } from "@/lib/utils/api/cookie-utils";
import { safeFetch } from "@/lib/utils/api/safe-fetch";
import { EndpointPath } from "@/lib/utils/api/types";

/**
 * Performs a GET request to the specified API endpoint from the server.
 * @param endpoint The endpoint to send the request to, not including the base URL.
 * @param params An object with key-value pairs to be converted into query parameters.
 * @param options Optional fetch options to override defaults.
 * @returns A Promise that resolves to the Response object from the fetch call. 
 */
export async function serverGet(
  endpoint: EndpointPath,
  params: Record<string, string>,
  options?: RequestInit
): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  let queryString = "";
  if (Object.keys(params).length > 0) {
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

  return await safeFetch(url, requestOptions);
}
