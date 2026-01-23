import { useEffect, useMemo, useState, startTransition } from "react";

import { CheckIcon, EraserIcon, TrashIcon } from "@radix-ui/react-icons";

import { ResultsAvailabilityMap } from "@/core/availability/types";
import ParticipantChip from "@/features/event/results/participant-chip";
import { removePerson } from "@/features/event/results/remove-person";
import { ConfirmationDialog } from "@/features/system-feedback";
import { cn } from "@/lib/utils/classname";

type AttendeesPanelProps = {
  // Data
  hoveredSlot: string | null;
  participants: string[];
  availabilities: ResultsAvailabilityMap;
  selectedParticipants: string[];

  // State Handlers
  onParticipantToggle: (participant: string) => void;
  setHoveredParticipant: (participant: string | null) => void;

  // Context / Actions
  isCreator: boolean;
  currentUser: string;
  eventCode: string;
  removeOptimisticParticipant: (p: string) => void;
  updateOptimisticAvailabilities: (p: string) => void;
  handleError: (field: string, message: string) => void;
};

export default function AttendeesPanel({
  hoveredSlot,
  participants,
  availabilities,
  selectedParticipants,
  onParticipantToggle,
  setHoveredParticipant,
  isCreator,
  currentUser,
  eventCode,
  removeOptimisticParticipant,
  updateOptimisticAvailabilities,
  handleError,
}: AttendeesPanelProps) {
  /* REMOVING STATES */
  const [isRemoving, setIsRemoving] = useState(false);
  const showSelfRemove =
    !isCreator && currentUser && participants.includes(currentUser);

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

  const handleRemovePerson = async (person: string) => {
    // IMMEDIATE: Update the UI right now
    startTransition(() => {
      removeOptimisticParticipant(person);
      updateOptimisticAvailabilities(person);
    });

    // BACKGROUND: Call the server action
    return await removePerson(eventCode, person, isCreator, handleError);
  };

  return (
    <div className="bg-panel space-y-1 rounded-3xl shadow-md md:shadow-none">
      <div className="flex justify-between px-6 pt-6">
        <div className="flex flex-col">
          <h2 className="text-md font-semibold">Attendees</h2>
          {participants.length > 0 && (
            <span className="text-sm">{`${activeCount}/${participants.length} available`}</span>
          )}
        </div>

        {participants.length > 0 && isCreator && (
          <button
            className={cn(
              "text-red bg-red/15 h-9 w-9 rounded-full p-2 text-sm font-semibold",
              "hover:bg-red/25 active:bg-red/40 cursor-pointer",
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

        {showSelfRemove && (
          <ConfirmationDialog
            type="delete"
            title="Remove Yourself?"
            description="Are you sure you want to remove yourself from this event?"
            onConfirm={() => handleRemovePerson(currentUser)}
          >
            <button
              className="text-red bg-red/15 hover:bg-red/25 active:bg-red/40 h-9 w-9 cursor-pointer rounded-full p-2 text-sm font-semibold"
              aria-label="Remove self"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </ConfirmationDialog>
        )}
      </div>

      <ul
        className={cn(
          "max-h-31 flex flex-wrap gap-2 overflow-y-auto overflow-x-visible md:max-h-none md:overflow-visible",
          "mr-6 pb-6 pl-6 pr-1 pt-1",
        )}
      >
        {participants.length === 0 && (
          <li className="text-sm italic opacity-50">No attendees yet</li>
        )}
        {participants.map((person: string, index: number) => {
          return (
            <ParticipantChip
              key={person}
              index={index}
              person={person}
              isAvailable={
                !hoveredSlot || availabilities[hoveredSlot]?.includes(person)
              }
              isSelected={selectedParticipants.includes(person)}
              areSelected={selectedParticipants.length > 0}
              isRemoving={isRemoving && isCreator}
              onRemove={() => handleRemovePerson(person)}
              onHoverChange={(isHovering) =>
                !isRemoving && setHoveredParticipant(isHovering ? person : null)
              }
              onClick={() => !isRemoving && onParticipantToggle(person)}
            />
          );
        })}
      </ul>
    </div>
  );
}
