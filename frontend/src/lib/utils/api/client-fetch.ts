import { safeFetch } from "@/lib/utils/api/safe-fetch";
import { EndpointPath } from "@/lib/utils/api/types";

/**
 * Performs a GET request to the specified API endpoint from the client.
 * @param endpoint The endpoint to send the request to, not including the base URL.
 * @param params An object with key-value pairs to be converted into query parameters.
 * @param options Optional fetch options to override defaults.
 * @returns A Promise that resolves to the Response object from the fetch call. 
 */
export async function clientGet(
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

  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ...options,
  };

  return await safeFetch(url, requestOptions);
}

/**
 * Performs a POST request to the specified API endpoint from the client.
 * @param endpoint The endpoint to send the request to, not including the base URL.
 * @param body An object representing the JSON body to be sent with the request.
 * @param options Optional fetch options to override defaults.
 * @returns A Promise that resolves to the Response object from the fetch call.
 */
export async function clientPost(
  endpoint: EndpointPath,
  body: object,
  options?: RequestInit
): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}${endpoint}`;

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
    ...options,
  };

  return await safeFetch(url, requestOptions);
}
