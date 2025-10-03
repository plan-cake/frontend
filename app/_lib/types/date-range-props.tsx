import { Dispatch } from "react";
import { EventRange } from "@/app/_lib/schedule/types";
import { EventRangeAction } from "@/app/_lib/eventRangeReducer";

export type DateRangeProps = {
  eventRange: EventRange;
  dispatch: Dispatch<EventRangeAction>;

  displayCalendar?: boolean;
};
