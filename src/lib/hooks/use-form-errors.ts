import { useState, useMemo, useCallback } from "react";

import { useToast } from "@/features/toast/context";
import { MESSAGES } from "@/lib/messages";

export function useFormErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addToast } = useToast();

  const handleError = useCallback(
    (field: string, message: string) => {
      if (field === "api" || field === "toast") {
        addToast("error", message);
      } else if (field === "rate_limit" && !message) {
        message = MESSAGES.ERROR_RATE_LIMIT;
      }

      setErrors((prev) => ({
        ...prev,
        [field]: message,
      }));
    },
    [addToast],
  );

  const clearAllErrors = useCallback(() => setErrors({}), []);

  const handleGenericError = useCallback(() => {
    addToast("error", MESSAGES.ERROR_GENERIC);
  }, [addToast]);

  return useMemo(
    () => ({
      errors,
      handleError,
      clearAllErrors,
      handleGenericError,
    }),
    [errors, handleError, clearAllErrors, handleGenericError],
  );
}
