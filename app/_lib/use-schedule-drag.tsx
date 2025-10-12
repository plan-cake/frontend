import { useState, useEffect, useRef, useCallback } from "react";

/**
 * hook to manage the drag-to-select logic for the schedule grid.
 * it includes state, event handlers, and global listeners for both mouse and touch events.
 */
export default function useScheduleDrag(
  onToggle: (slotIso: string) => void,
  mode: "paint" | "view" | "preview",
) {
  const [isDragging, setIsDragging] = useState(false);
  const [didTouch, setDidTouch] = useState(false); // prevents mousedown from firing after touchend
  const draggedSlots = useRef<Set<string>>(new Set());

  // keeps onToggle ref up to date
  const onToggleRef = useRef(onToggle);
  useEffect(() => {
    onToggleRef.current = onToggle;
  }, [onToggle]);

  // handle stopping drag on mouseup/touchend anywhere
  useEffect(() => {
    const stopDragging = () => {
      if (isDragging) {
        setIsDragging(false);
        draggedSlots.current.clear();
      }
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
      setIsDragging(true);
      draggedSlots.current = new Set([slotIso]);
      onToggleRef.current(slotIso);
    },
    [mode, didTouch],
  );

  const handleMouseEnter = useCallback(
    (slotIso: string, isDisabled: boolean) => {
      if (
        mode !== "paint" ||
        !isDragging ||
        isDisabled ||
        draggedSlots.current.has(slotIso)
      )
        return;
      draggedSlots.current.add(slotIso);
      onToggleRef.current(slotIso);
    },
    [mode, isDragging],
  );

  const handleTouchStart = useCallback(
    (slotIso: string, isDisabled: boolean) => {
      if (mode !== "paint" || isDisabled) return;
      setDidTouch(true);
      setIsDragging(true);
      draggedSlots.current = new Set([slotIso]);
      onToggleRef.current(slotIso);
    },
    [mode],
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (mode !== "paint" || !isDragging) return;

      // get touchpoint
      const touch = event.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      if (target instanceof HTMLElement && target.dataset.slotIso) {
        const currentSlotIso = target.dataset.slotIso;
        // check that the slot is not disabled
        if (!draggedSlots.current.has(currentSlotIso)) {
          draggedSlots.current.add(currentSlotIso);
          onToggleRef.current(currentSlotIso);
        }
      }
    },
    [mode, isDragging],
  );

  return {
    onMouseDown: handleMouseDown,
    onMouseEnter: handleMouseEnter,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
  };
}
