import {
  AvailabilitySet,
  ResultsAvailabilityMap,
} from "@/core/availability/types";

export type TimeBlockProps = {
  numQuarterHours: number;
  visibleDaysCount: number;
  children: React.ReactNode;
  hasPrev?: boolean;
  hasNext?: boolean;
};

type CommonBlockProps = {
  numQuarterHours: number;
  startHour: number;
  timeslots: Date[];
  numVisibleDays: number;
  visibleDayKeys: string[];
  userTimezone: string;
  hasPrev?: boolean;
  hasNext?: boolean;
};

export type PreviewTimeBlockProps = CommonBlockProps;

export type InteractiveTimeBlockProps = CommonBlockProps & {
  availability: AvailabilitySet;
  onToggle: (slotIso: string, togglingOn: boolean) => void;
};

export type ResultsTimeBlockProps = CommonBlockProps & {
  hoveredSlot: string | null | undefined;
  availabilities: ResultsAvailabilityMap;
  numParticipants: number;
  onHoverSlot?: (iso: string | null) => void;
};
