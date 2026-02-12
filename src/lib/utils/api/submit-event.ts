import { EventRange } from "@/core/event/types";
import { EventEditorType } from "@/features/event/editor/types";
import { MESSAGES } from "@/lib/messages";
import { formatApiError } from "@/lib/utils/api/handle-api-error";
import { timeslotToISOString } from "@/lib/utils/date-time-format";

export type EventSubmitData = {
  title: string;
  code: string;
  eventRange: EventRange;
  timeslots: Date[];
};

type EventSubmitJsonBody = {
  title: string;
  duration?: number;
  time_zone: string;
  timeslots: string[];
  custom_code?: string;
  event_code?: string;
};

export default async function submitEvent(
  data: EventSubmitData,
  type: EventEditorType,
  eventType: "specific" | "weekday",
  onSuccess: (code: string) => void,
  handleError: (field: string, message: string) => void,
): Promise<boolean> {
  let apiRoute = `${process.env.NEXT_PUBLIC_API_URL}/event`;

  if (eventType === "specific") {
    apiRoute +=
      type === "new" ? "/date-create/" : "/date-edit/";
  } else {
    apiRoute +=
      type === "new" ? "/week-create/" : "/week-edit/";
  }

  if (data.timeslots.length === 0) {
    handleError("toast", "No valid timeslots generated for this range.");
    return false;
  }

  const jsonBody: EventSubmitJsonBody = {
    title: data.title,
    time_zone: data.eventRange.timezone,
    timeslots: data.timeslots.map((d) =>
      timeslotToISOString(d, data.eventRange.timezone, eventType),
    ),
  };

  // only include duration if set
  if (data.eventRange.duration && data.eventRange.duration > 0) {
    jsonBody.duration = data.eventRange.duration;
  }

  if (type === "new" && data.code) {
    jsonBody.custom_code = data.code;
  } else if (type === "edit") {
    jsonBody.event_code = data.code;
  }

  try {
    const res = await fetch(apiRoute, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(jsonBody),
    });
    if (res.ok) {
      const code = (await res.json()).event_code;
      if (type === "new") {
        onSuccess(code);
        return true;
      } else {
        // endpoint does not return code on edit
        onSuccess(data.code);
        return true;
      }
    } else {
      const body = await res.json();
      const errorMessage = formatApiError(body);

      if (res.status === 429) {
        handleError("rate_limit", errorMessage);
      } else {
        handleError("toast", formatApiError(body));
      }

      return false;
    }
  } catch (err) {
    console.error("Fetch error:", err);
    handleError("toast", MESSAGES.ERROR_GENERIC);
    return false;
  }
}
