import {
  useState,
  useOptimistic,
  useMemo,
  useCallback,
  startTransition,
} from "react";

import { ResultsAvailabilityMap } from "@/core/availability/types";
import { AvailabilityDataResponse } from "@/features/event/availability/fetch-data";
import { removePerson } from "@/features/event/results/remove-person";

export function useEventResults(
  initialData: AvailabilityDataResponse,
  eventCode: string,
  isCreator: boolean,
  handleError: (field: string, message: string) => void,
) {
  /* STATES */
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    [],
  );
  const [hoveredParticipant, setHoveredParticipant] = useState<string | null>(
    null,
  );
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const [optimisticParticipants, removeOptimisticParticipant] = useOptimistic(
    initialData.participants || [],
    (state, personToRemove: string) => {
      return state.filter((p) => p !== personToRemove);
    },
  );

  const [optimisticAvailabilities, updateOptimisticAvailabilities] =
    useOptimistic(initialData.availability || {}, (state, person: string) => {
      const updatedState = { ...state };
      for (const slot in updatedState) {
        updatedState[slot] = updatedState[slot].filter((p) => p !== person);
      }
      return updatedState;
    });

  /* ACTIONS */
  const handleSetHoveredParticipant = useCallback((person: string | null) => {
    setHoveredParticipant(person);
    if (person) {
      setHoveredSlot(null);
    }
  }, []);

  const toggleParticipant = (person: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(person)
        ? prev.filter((p) => p !== person)
        : [...prev, person],
    );
  };

  const handleRemoveParticipant = async (person: string) => {
    // Immediate UI update
    if (selectedParticipants.includes(person)) {
      setSelectedParticipants((prev) => prev.filter((p) => p !== person));
    }

    startTransition(() => {
      removeOptimisticParticipant(person);
      updateOptimisticAvailabilities(person);
    });

    // Server Action
    return await removePerson(eventCode, person, isCreator, handleError);
  };

  /* DERIVED LOGIC */
  const { filteredAvailabilities, gridNumParticipants } = useMemo(() => {
    let activeParticipants: string[] = [];

    if (selectedParticipants.length > 0) {
      activeParticipants = selectedParticipants;
    } else if (hoveredParticipant) {
      activeParticipants = [hoveredParticipant];
    } else {
      return {
        filteredAvailabilities: optimisticAvailabilities,
        gridNumParticipants: optimisticParticipants.length,
      };
    }

    const filtered: ResultsAvailabilityMap = {};
    for (const slot in optimisticAvailabilities) {
      const availablePeople = optimisticAvailabilities[slot];
      const intersection = availablePeople.filter((p) =>
        activeParticipants.includes(p),
      );
      if (intersection.length > 0) {
        filtered[slot] = intersection;
      }
    }

    return {
      filteredAvailabilities: filtered,
      gridNumParticipants: activeParticipants.length,
    };
  }, [
    optimisticAvailabilities,
    optimisticParticipants.length,
    selectedParticipants,
    hoveredParticipant,
  ]);

  return {
    // Data
    participants: optimisticParticipants,
    availabilities: optimisticAvailabilities,
    filteredAvailabilities,
    gridNumParticipants,

    // UI State
    hoveredSlot,
    hoveredParticipant,
    selectedParticipants,

    // Actions
    clearSelectedParticipants: () => setSelectedParticipants([]),
    setHoveredSlot,
    setHoveredParticipant: handleSetHoveredParticipant,
    toggleParticipant,
    handleRemoveParticipant,
  };
}
