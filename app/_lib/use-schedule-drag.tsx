import { useState, useEffect, useRef, useCallback } from "react";
import { generateDragSlots } from "./availability/utils";

type DragState = {
  startSlot: string | null;
  endSlot: string | null;
  togglingOn: boolean | null;
};

/**
 * hook to manage the drag-to-select logic for the schedule grid.
 * it includes state, event handlers, and global listeners for both mouse and touch events.
 */
export default function useScheduleDrag(
  onToggle: (slotIso: string, togglingOn: boolean) => void,
  mode: "paint" | "view" | "preview",
) {
  const [draggedSlots, setDraggedSlots] = useState<Set<string>>(new Set());
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const dragState = useRef<DragState>({
    startSlot: null,
    endSlot: null,
    togglingOn: null,
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
    dragState.current = {
      startSlot: null,
      endSlot: null,
      togglingOn: null,
    };
    setDraggedSlots(new Set());
    setHoveredSlot(null);
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
        onToggleRef.current(slotIso, dragState.current.togglingOn!);
      }
      resetDragSlots();
    };

    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchend", stopDragging);

    return () => {
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging]);

  /* EVENT HANDLERS */

  const handlePointerDown = useCallback(
    (slotIso: string, isDisabled: boolean, toggleState: boolean) => {
      if (mode !== "paint" || isDisabled) return;
      setDragSlot(slotIso);
      dragState.current.togglingOn = !toggleState;
    },
    [mode],
  );

  const handlePointerEnter = useCallback(
    (slotIso: string, isDisabled: boolean) => {
      if (mode !== "paint" || isDisabled) return;
      setHoveredSlot(slotIso);
      if (!isDragging()) return;
      setDragSlot(slotIso);
    },
    [mode],
  );

  const handlePointerLeave = useCallback(() => {
    setHoveredSlot(null);
  }, []);

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
    onPointerDown: handlePointerDown,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
    onTouchMove: handleTouchMove,
    draggedSlots: draggedSlots,
    togglingOn: dragState.current.togglingOn,
    hoveredSlot: hoveredSlot,
  };
}
