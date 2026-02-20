import { ApiErrorData } from "@/lib/utils/api/handle-api-error";

export class ApiErrorResponse extends Error {
  readonly status: number;
  readonly data: ApiErrorData;
  readonly badRequest: boolean;
  readonly serverError: boolean;

  constructor(status: number, data: ApiErrorData) {
    super(`API Error: ${status}`);
    this.status = status;
    this.data = data;
    this.badRequest = status >= 400 && status < 500;
    this.serverError = status >= 500;
  }
}

/**
 * A fetch API wrapper that directly returns JSON data.
 * 
 * If either the status is not in the 200-299 range, an error is thrown with the error
 * data from the response.
 * 
 * If the fetch call itself fails, a 503 error is thrown.
 * 
 * @param url The URL to fetch.
 * @param options The options to pass to the fetch call.
 * @returns A Promise that resolves to the Response object from the fetch call, or a 503 response if an error occurs.
 */
export async function fetchJson(url: string, options: RequestInit): Promise<object> {
  let response;

  try {
    response = await fetch(url, options);
  } catch (e) {
    console.log("CAUGHT FETCH ERROR", e);
    throw new ApiErrorResponse(503, { error: { general: ["Service unavailable, please try again later."] } });
  }

  if (response.ok) {
    return await response.json();
  } else {
    const errorData: ApiErrorData = await response.json();
    throw new ApiErrorResponse(response.status, errorData);
  }
}
