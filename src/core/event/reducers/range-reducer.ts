import { EventRange, WeekdayMap } from "@/core/event/types";

export type EventRangeAction =
  | { type: "SET_RANGE_INFO"; payload: EventRange }
  | { type: "SET_RANGE_TYPE"; payload: "specific" | "weekday" }
  | { type: "SET_DATE_RANGE"; payload: { from: string; to: string } }
  | { type: "SET_START_TIME"; payload: number }
  | { type: "SET_END_TIME"; payload: number }
  | {
      type: "SET_WEEKDAYS";
      payload: { weekdays: Partial<Record<keyof WeekdayMap, 0 | 1>> };
    }
  | { type: "SET_DURATION"; payload: number }
  | { type: "SET_TIMEZONE"; payload: string }
  | { type: "RESET" };

export function EventRangeReducer(
  state: EventRange,
  action: EventRangeAction,
): EventRange {
  switch (action.type) {
    case "SET_RANGE_INFO": {
      return {
        ...action.payload,
      };
    }

    case "SET_RANGE_TYPE": {
      if (action.payload === state.type) {
        return state;
      }

      const baseEvent = {
        duration: state.duration,
        timezone: state.timezone,
        timeRange: state.timeRange,
      };

      if (action.payload === "specific") {
        return {
          ...baseEvent,
          type: "specific",
          dateRange: {
            from: new Date().toISOString(),
            to: new Date().toISOString(),
          },
        };
      } else {
        return {
          ...baseEvent,
          type: "weekday",
          weekdays: { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 },
        };
      }
    }

    case "SET_DATE_RANGE": {
      if (state.type !== "specific") {
        return state;
      }

      return {
        ...state,
        dateRange: {
          from: action.payload.from,
          to: action.payload.to,
        },
      };
    }

    case "SET_START_TIME": {
      return {
        ...state,
        timeRange: {
          from: action.payload,
          to: state.timeRange.to,
        },
      };
    }

    case "SET_END_TIME": {
      return {
        ...state,
        timeRange: {
          from: state.timeRange.from,
          to: action.payload,
        },
      };
    }

    case "SET_WEEKDAYS": {
      if (state.type !== "weekday") {
        return state;
      }

      return {
        ...state,
        weekdays: {
          ...state.weekdays,
          ...action.payload.weekdays,
        },
      };
    }

    case "SET_DURATION": {
      return {
        ...state,
        duration: action.payload,
      };
    }

    case "SET_TIMEZONE": {
      return {
        ...state,
        timezone: action.payload,
      };
    }

    case "RESET": {
      if (state.type === "specific") {
        return {
          type: "specific",
          duration: 30,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          dateRange: {
            from: new Date().toISOString(),
            to: new Date().toISOString(),
          },
          timeRange: { from: 9, to: 17 },
        };
      } else {
        return {
          type: "weekday",
          duration: 30,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          weekdays: { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 },
          timeRange: { from: 9, to: 17 },
        };
      }
    }

    default:
      return state;
  }
}
