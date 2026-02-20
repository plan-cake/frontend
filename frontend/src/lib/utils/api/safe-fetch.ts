/**
 * A fetch API wrapper that catches errors and returns a 503 response instead of throwing.
 * @param url The URL to fetch.
 * @param options The options to pass to the fetch call.
 * @returns A Promise that resolves to the Response object from the fetch call, or a 503 response if an error occurs.
 */
export async function safeFetch(url: string, options: RequestInit): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch {
    return new Response(JSON.stringify({ error: { general: "Service Unavailable" } }), { status: 503, statusText: "Service Unavailable" });
  }
}
