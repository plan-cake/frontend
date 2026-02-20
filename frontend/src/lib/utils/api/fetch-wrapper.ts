type ErrorObject = {
  [subject: string]: string[];
}

export class ApiErrorResponse extends Error {
  status: number;
  error: ErrorObject;

  constructor(status: number, error: ErrorObject) {
    super(`API Error: ${status}`);
    this.status = status;
    this.error = error;
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
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      return await response.json();
    } else {
      const errorData: ErrorObject = (await response.json()).error;
      throw new ApiErrorResponse(response.status, errorData);
    }
  } catch {
    throw new ApiErrorResponse(503, { general: ["Service Unavailable"] });
  }
}
