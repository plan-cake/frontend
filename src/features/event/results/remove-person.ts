"use server";

import { revalidatePath } from "next/cache";

import { getAuthCookieString } from "@/lib/utils/api/cookie-utils";

export async function removePerson(
  eventCode: string,
  person: string,
  isCreator: boolean,
  handleError: (field: string, message: string) => void,
) {
  const authCookies = await getAuthCookieString();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const apiRoute = isCreator
    ? `${baseUrl}/availability/remove/`
    : `${baseUrl}/availability/remove-self/`;

  try {
    const response = await fetch(apiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookies,
      },
      cache: "no-store",
      body: JSON.stringify({
        event_code: eventCode,
        display_name: isCreator ? person : undefined,
      }),
    });

    if (!response.ok) {
      handleError("toast", response.statusText);
      return false;
    }

    // Revalidate the event page to reflect changes
    revalidatePath(`/${eventCode}`);

    return true;
  } catch (error) {
    handleError("toast", "Error removing participant");
    console.error("Error removing participant:", error);
    return false;
  }
}
