import { useState, useEffect, useRef, useCallback } from "react";
import { generateDragSlots } from "./availability/utils";

type DragState = {
  startSlot: string | null;
  endSlot: string | null;
};

/**
 * hook to manage the drag-to-select logic for the schedule grid.
 * it includes state, event handlers, and global listeners for both mouse and touch events.
 */
export default function useScheduleDrag(
  onToggle: (slotIso: string) => void,
  mode: "paint" | "view" | "preview",
) {
  const [didTouch, setDidTouch] = useState(false); // prevents mousedown from firing after touchend
  const [draggedSlots, setDraggedSlots] = useState<Set<string>>(new Set());
  const dragState = useRef<DragState>({
    startSlot: null,
    endSlot: null,
  });

  function isDragging() {
    return (
      dragState.current.startSlot !== null || dragState.current.endSlot !== null
    );
  }

  function setDragSlot(slotIso: string) {
    if (!dragState.current.startSlot) {
      dragState.current.startSlot = slotIso;
    }
    dragState.current.endSlot = slotIso;
    // update draggedSlots
    setDraggedSlots(
      generateDragSlots(dragState.current.startSlot, dragState.current.endSlot),
    );
  }

  function resetDragSlots() {
    dragState.current = { startSlot: null, endSlot: null };
    setDraggedSlots(new Set());
  }

  // keeps onToggle ref up to date
  const onToggleRef = useRef(onToggle);
  useEffect(() => {
    onToggleRef.current = onToggle;
  }, [onToggle]);

  // handle stopping drag on mouseup/touchend anywhere
  useEffect(() => {
    const stopDragging = () => {
      for (const slotIso of draggedSlots) {
        onToggleRef.current(slotIso);
      }
      resetDragSlots();
      if (didTouch) {
        // reset didTouch after a short delay to prevent
        // immediate re-triggering
        setTimeout(() => setDidTouch(false), 50);
      }
    };

    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchend", stopDragging);

    return () => {
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging, didTouch]);

  /* EVENT HANDLERS */

  const handleMouseDown = useCallback(
    (slotIso: string, isDisabled: boolean) => {
      if (mode !== "paint" || isDisabled || didTouch) return;
      setDragSlot(slotIso);
    },
    [mode, didTouch],
  );

  const handleMouseEnter = useCallback(
    (slotIso: string, isDisabled: boolean) => {
      if (mode !== "paint" || !isDragging() || isDisabled) return;
      setDragSlot(slotIso);
    },
    [mode],
  );

  const handleTouchStart = useCallback(
    (slotIso: string, isDisabled: boolean) => {
      if (mode !== "paint" || isDisabled) return;
      setDidTouch(true);
      setDragSlot(slotIso);
    },
    [mode],
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (mode !== "paint" || !isDragging()) return;

      // get touchpoint
      const touch = event.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      if (target instanceof HTMLElement && target.dataset.slotIso) {
        const currentSlotIso = target.dataset.slotIso;
        setDragSlot(currentSlotIso);
      }
    },
    [mode],
  );

  return {
    onMouseDown: handleMouseDown,
    onMouseEnter: handleMouseEnter,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    draggedSlots: draggedSlots,
  };
}
