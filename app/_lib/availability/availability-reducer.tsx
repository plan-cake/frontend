import { AvailabilitySet } from "./types";
import { createEmptyUserAvailability, toggleUtcSlot } from "./utils";

export interface AvailabilityState {
  displayName: string;
  timeZone: string;
  userAvailability: AvailabilitySet;
}

export type AvailabilityAction =
  | { type: "RESET_AVAILABILITY" }
  | { type: "SET_DISPLAY_NAME"; payload: string }
  | { type: "SET_TIME_ZONE"; payload: string }
  | {
      type: "TOGGLE_SLOT";
      payload: { slot: string };
    };

// 3. Create the reducer function
export function availabilityReducer(
  state: AvailabilityState,
  action: AvailabilityAction,
): AvailabilityState {
  switch (action.type) {
    case "RESET_AVAILABILITY": {
      return {
        ...state,
        userAvailability: createEmptyUserAvailability(),
      };
    }

    case "SET_DISPLAY_NAME": {
      return {
        ...state,
        displayName: action.payload,
      };
    }

    case "SET_TIME_ZONE": {
      return {
        ...state,
        timeZone: action.payload,
      };
    }

    case "TOGGLE_SLOT": {
      const { slot } = action.payload;
      return {
        ...state,
        userAvailability: toggleUtcSlot(state.userAvailability, slot),
      };
    }

    default: {
      return state;
    }
  }
}
