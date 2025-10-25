import { AvailabilitySet } from "@/src/core/availability/types";
import {
  createEmptyUserAvailability,
  toggleUtcSlot,
} from "@/src/core/availability/utils";

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
      payload: { slot: string; togglingOn: boolean };
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
      const { slot, togglingOn } = action.payload;
      return {
        ...state,
        userAvailability: toggleUtcSlot(
          state.userAvailability,
          slot,
          togglingOn,
        ),
      };
    }

    default: {
      return state;
    }
  }
}
