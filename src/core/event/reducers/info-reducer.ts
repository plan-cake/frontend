import { expandEventRange } from "@/core/event/lib/expand-event-range";
import {
  EventRangeReducer,
  EventRangeAction,
} from "@/core/event/reducers/range-reducer";
import { EventInformation } from "@/core/event/types";

export type EventInfoAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_CUSTOM_CODE"; payload: string }
  | EventRangeAction
  | { type: "RESET" };

export function EventInfoReducer(
  state: EventInformation,
  action: EventInfoAction,
): EventInformation {
  switch (action.type) {
    case "SET_TITLE":
      return {
        ...state,
        title: action.payload,
      };
    case "SET_CUSTOM_CODE":
      return {
        ...state,
        customCode: action.payload,
      };
    case "RESET":
      const defaultRange = {
        type: "specific" as const,
        duration: 60,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateRange: {
          from: new Date().toISOString(),
          to: new Date().toISOString(),
        },
        timeRange: { from: 9, to: 17 },
      };

      return {
        title: "",
        customCode: "",
        eventRange: defaultRange,
        timeslots: expandEventRange(defaultRange),
      };
    default:
      const newEventRange = EventRangeReducer(
        state.eventRange,
        action as EventRangeAction,
      );

      if (newEventRange === state.eventRange) {
        return state;
      }

      return {
        ...state,
        eventRange: newEventRange,
        timeslots: expandEventRange(newEventRange),
      };
  }
}
