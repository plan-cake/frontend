import { useEffect, useMemo, useState } from "react";

import { CheckIcon, EraserIcon } from "@radix-ui/react-icons";

import { ResultsAvailabilityMap } from "@/core/availability/types";
import ParticipantChip from "@/features/event/results/participant-chip";
import { cn } from "@/lib/utils/classname";

export default function AttendeesPanel({
  hoveredSlot,
  participants,
  availabilities,
  isCreator,
  eventCode,
  setParticipants,
  setAvailabilities,
}: {
  hoveredSlot: string | null;
  participants: string[];
  availabilities: ResultsAvailabilityMap;
  isCreator: boolean;
  eventCode: string;
  setParticipants: React.Dispatch<React.SetStateAction<string[]>>;
  setAvailabilities: React.Dispatch<
    React.SetStateAction<ResultsAvailabilityMap>
  >;
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  const activeCount = useMemo(() => {
    if (!hoveredSlot) return participants.length;
    return participants.filter((p) => availabilities[hoveredSlot]?.includes(p))
      .length;
  }, [hoveredSlot, participants, availabilities]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsRemoving(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleRemove = async (person: string) => {
    if (!isCreator) return false;

    try {
      const response = await fetch("/api/availability/remove/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_code: eventCode,
          display_name: person,
        }),
      });

      if (!response.ok) {
        console.log("Failed to remove participant:", response.statusText);
        return false;
      }

      setParticipants((prev) => prev.filter((p) => p !== person));
      setAvailabilities((prev) => {
        const updated = { ...prev };
        for (const slot in updated) {
          updated[slot] = updated[slot].filter((p) => p !== person);
        }
        return updated;
      });

      if (participants.length <= 1) setIsRemoving(false);

      return true;
    } catch (error) {
      console.error("Error removing participant:", error);
      return false;
    }
  };

  return (
    <div className="bg-panel rounded-3xl p-4 shadow-md md:space-y-2 md:p-6 md:shadow-none">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-semibold">
          Attendees <span>{`(${activeCount}/${participants.length})`}</span>
        </h2>
        {participants.length > 0 && (
          <button
            className={cn(
              "text-red bg-red/15 rounded-full p-2 text-sm font-semibold",
              "hover:bg-red/25 active:bg-red/40",
            )}
            onClick={() => setIsRemoving(!isRemoving)}
          >
            {isRemoving ? (
              <CheckIcon className="h-5 w-5" />
            ) : (
              <EraserIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      <ul className="flex flex-wrap gap-2">
        {participants.length === 0 && (
          <li className="text-sm italic opacity-50">No attendees yet</li>
        )}
        {participants.map((person: string, index: number) => {
          return (
            <ParticipantChip
              key={person}
              person={person}
              index={index}
              isAvailable={
                !hoveredSlot || availabilities[hoveredSlot]?.includes(person)
              }
              isRemoving={isRemoving && isCreator}
              onRemove={() => handleRemove(person)}
            />
          );
        })}
      </ul>
    </div>
  );
}
