import { useEffect, useMemo, useState } from "react";

import {
  CheckIcon,
  EraserIcon,
  ExitIcon,
  ResetIcon,
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
    if (!hoveredSlot) return null;
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
    <div className="bg-panel relative flex flex-col overflow-hidden rounded-3xl shadow-md md:shadow-none">
      <div
        className={cn(
          "absolute left-0 right-0 top-0 z-10",
          "bg-panel flex touch-none select-none justify-between px-6 pb-2 pt-6",
        )}
      >
        <div className="flex flex-col">
          <h2 className="text-md font-semibold">
            {isRemoving ? "Removing a" : "A"}ttendees
          </h2>
          {displayParticipants.length > 0 && (
            <span className="text-sm opacity-75">
              {isRemoving
                ? `Select to remove`
                : activeCount === null
                  ? "Hover grid for availability"
                  : `${activeCount}/${displayParticipants.length} available`}
            </span>
          )}
        </div>
        <div className="space-x-2">
          <button
            tabIndex={hasSelection ? 0 : -1}
            className={cn(
              "bg-accent/15 text-accent rounded-full p-2 text-sm font-semibold transition-[shadow,opacity] duration-200",
              "hover:bg-accent/25 active:bg-accent/40 cursor-pointer",
              hasSelection ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            onClick={clearSelectedParticipants}
          >
            <ResetIcon className="h-6 w-6" />
          </button>

          {participants.length > 0 && isCreator && (
            <button
              className={cn(
                "text-red bg-red/15 rounded-full p-2 text-sm font-semibold",
                "hover:bg-red/25 active:bg-red/40 cursor-pointer",
              )}
              onClick={() => setIsRemoving(!isRemoving)}
            >
              {isRemoving ? (
                <CheckIcon className="h-6 w-6" />
              ) : (
                <EraserIcon className="h-6 w-6" />
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
                className="text-red bg-red/15 hover:bg-red/25 active:bg-red/40 cursor-pointer rounded-full p-2 text-sm font-semibold"
                aria-label="Remove self"
              >
                <ExitIcon className="h-6 w-6" />
              </button>
            </ConfirmationDialog>
          )}
        </div>
      </div>

      <ul
        className={cn(
          "max-h-53 flex flex-wrap gap-3 overflow-y-auto px-6 pb-6 pt-20 md:max-h-none md:gap-2.5",
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
