import { ResultsAvailabilityMap } from "@/core/availability/types";
import { hasMutualAvailability } from "@/features/event/results/utils";
import { Banner } from "@/features/system-feedback/banner/base";

export function getResultBanners(
  availabilities: ResultsAvailabilityMap,
  participants: string[],
  timeslots: Date[],
  isWeekEvent: boolean,
) {
  if (
    !isWeekEvent &&
    timeslots.length > 0 &&
    timeslots[timeslots.length - 1] < new Date()
  ) {
    return (
      <Banner type="info" noTitle showPing>
        <p className="font-semibold">This event has passed.</p>
      </Banner>
    );
  } else if (participants.length === 0) {
    return (
      <Banner type="info" noTitle showPing>
        <p className="font-semibold">No one filled out a time yet!</p>
        <p>Add your availability by clicking the button above.</p>
      </Banner>
    );
  } else if (participants.length === 1) {
    return (
      <Banner type="info" noTitle showPing>
        <p className="font-semibold">Waiting for others...</p>
        <p>Copy and share the link so others can join!</p>
      </Banner>
    );
  } else if (!hasMutualAvailability(availabilities, participants)) {
    return (
      <Banner type="info" noTitle showPing>
        <p className="font-semibold">Oh dear :(</p>
        <p>No one is available at the same time.</p>
      </Banner>
    );
  }
}
