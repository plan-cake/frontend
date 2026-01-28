import { useEffect, useMemo, useState } from "react";

import {
  CheckIcon,
  EraserIcon,
  ResetIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

import { ResultsAvailabilityMap } from "@/core/availability/types";
import ParticipantChip from "@/features/event/results/participant-chip";
import { ConfirmationDialog } from "@/features/system-feedback";
import { cn } from "@/lib/utils/classname";

type AttendeesPanelProps = {
  // Data
  hoveredSlot: string | null;
  participants: string[];
  availabilities: ResultsAvailabilityMap;
  selectedParticipants: string[];

  // State Handlers
  clearSelectedParticipants: () => void;
  onParticipantToggle: (participant: string) => void;
  setHoveredParticipant: (participant: string | null) => void;

  // Context / Actions
  isCreator: boolean;
  currentUser: string;
  onRemoveParticipant: (person: string) => Promise<boolean>;
};

export default function AttendeesPanel({
  hoveredSlot,
  participants,
  availabilities,
  selectedParticipants,
  clearSelectedParticipants,
  onParticipantToggle,
  setHoveredParticipant,
  isCreator,
  currentUser,
  onRemoveParticipant,
}: AttendeesPanelProps) {
  /* REMOVING STATES */
  const [isRemoving, setIsRemoving] = useState(false);
  const showSelfRemove =
    !isCreator && currentUser && participants.includes(currentUser);

  const hasSelection = selectedParticipants.length > 0;
  const displayParticipants = useMemo(() => {
    if (selectedParticipants.length === 0) return participants;
    return selectedParticipants;
  }, [selectedParticipants, participants]);

  const activeCount = useMemo(() => {
    if (!hoveredSlot) return displayParticipants.length;
    return displayParticipants.filter((p) =>
      availabilities[hoveredSlot]?.includes(p),
    ).length;
  }, [hoveredSlot, displayParticipants, availabilities]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsRemoving(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="bg-panel space-y-1 rounded-3xl shadow-md md:shadow-none">
      <div className="flex justify-between px-6 pt-6">
        <div className="flex flex-col">
          <h2 className="text-md font-semibold">Attendees</h2>
          {displayParticipants.length > 0 && (
            <span className="text-sm">{`${activeCount}/${displayParticipants.length} available`}</span>
          )}
        </div>

        <div className="space-x-2">
          <button
            tabIndex={hasSelection ? 0 : -1}
            className={cn(
              "bg-accent/15 text-accent h-9 w-9 rounded-full p-2 text-sm font-semibold transition-[shadow,opacity] duration-200",
              "hover:bg-accent/25 active:bg-accent/40 cursor-pointer",
              hasSelection ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            onClick={clearSelectedParticipants}
          >
            <ResetIcon className="h-5 w-5" />
          </button>

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
              onConfirm={() => onRemoveParticipant(currentUser)}
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
              onRemove={() => onRemoveParticipant(person)}
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
