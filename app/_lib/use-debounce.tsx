import { useEffect, useRef } from "react";

export function useDebounce(
  effect: () => void,
  deps: any[],
  delay: number = 1000,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      effect();
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [...deps, delay]);
}
