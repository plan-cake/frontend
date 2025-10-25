import { EventInformation } from "@/src/core/event/types";
import {
  EventRangeReducer,
  EventRangeAction,
} from "@/src/core/event/reducers/range-reducer";

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
      return {
        title: "",
        customCode: "",
        eventRange: {
          type: "specific",
          duration: 60,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          dateRange: {
            from: new Date().toISOString(),
            to: new Date().toISOString(),
          },
          timeRange: {
            from: 9,
            to: 17,
          },
        },
      };
    default:
      return {
        ...state,
        eventRange: EventRangeReducer(
          state.eventRange,
          action as EventRangeAction,
        ),
      };
  }
}
