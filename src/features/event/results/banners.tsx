import { ResultsAvailabilityMap } from "@/core/availability/types";
import { hasMutualAvailability } from "@/features/event/results/utils";
import { Banner } from "@/features/system-feedback/banner/base";

export function getResultBanners(
  availabilities: ResultsAvailabilityMap,
  participants: string[],
  timeslots: Date[],
  isWeekEvent: boolean,
  participated: boolean,
) {
  if (
    !isWeekEvent &&
    timeslots.length > 0 &&
    timeslots[timeslots.length - 1] < new Date()
  ) {
    return (
      <Banner
        type="info"
        subtitle="All the dates in this event have passed."
        showPing
      />
    );
  } else if (participants.length === 0) {
    return (
      <Banner
        type="info"
        subtitle="No one has submitted availability yet!"
        showPing
      >
        <p>Add your availability by clicking the button above.</p>
      </Banner>
    );
  } else if (participated && participants.length === 1) {
    return (
      <Banner type="info" subtitle="Waiting for others..." showPing>
        <p>Copy and share the link so others can join!</p>
      </Banner>
    );
  } else if (!participated) {
    return <Banner type="info" subtitle="Add your availability!" showPing />;
  } else if (!hasMutualAvailability(availabilities, participants)) {
    return (
      <Banner type="info" subtitle="Oh dear :(" showPing>
        <p>There is not a time where everyone is available.</p>
      </Banner>
    );
  }
}
