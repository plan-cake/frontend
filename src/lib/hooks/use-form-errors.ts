import { useState } from "react";

import { useToast } from "@/features/toast/context";
import { MESSAGES } from "@/lib/messages";

export function useFormErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addToast } = useToast();

  /*
   * Sets an error message for a specific field.
   * If the field is "api", also shows a toast notification.
   * If the field is "rate_limit" and no message is provided,
   * sets a default rate limit message.
   */
  const handleError = (field: string, message: string) => {
    if (field === "api" || field === "toast") {
      addToast("error", message);
    } else if (field === "rate_limit" && !message) {
      message = MESSAGES.ERROR_RATE_LIMIT;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };

  // Clears all error messages
  const clearAllErrors = () => setErrors({});

  // Helper for generic try/catch blocks
  const handleGenericError = () => {
    addToast("error", MESSAGES.ERROR_GENERIC);
  };

  return {
    errors,
    handleError,
    clearAllErrors,
    handleGenericError,
  };
}
