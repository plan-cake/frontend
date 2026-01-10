"use server";

import { revalidatePath } from "next/cache";

import { getAuthCookieString } from "@/lib/utils/api/cookie-utils";

export async function removePerson(
  eventCode: string,
  person: string,
  isCreator: boolean,
) {
  const authCookies = await getAuthCookieString();
  const baseUrl = process.env.API_URL;

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
      console.log("Failed to remove participant:", response.statusText);
      return false;
    }

    console.log("Participant removed successfully");

    // Revalidate the event page to reflect changes
    revalidatePath(`/${eventCode}`);

    return true;
  } catch (error) {
    console.error("Error removing participant:", error);
    return false;
  }
}
