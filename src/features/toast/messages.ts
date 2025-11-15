export const TOAST_MESSAGES = {
  // generic errors
  ERROR_GENERIC: "An error occurred. Please try again.",
  ERROR_RATE_LIMIT: "Too many requests. Please try again later.",

  // auth errors
  ERROR_EMAIL_MISSING: "Missing email.",
  ERROR_PASSWORD_MISSING: "Missing password.",
  ERROR_PASSWORD_REUSE: "Cannot reuse old password.",
  ERROR_PASSWORD_WEAK: "Password is not strong enough.",
  ERROR_PASSWORD_MISMATCH: "Passwords do not match.",
  ERROR_NAME_MISSING: "Missing name.",
  ERROR_NAME_TAKEN: "This code is unavailable. Please choose another.",

  // event errors
  ERROR_EVENT_NAME_MISSING: "Missing event name.",
  ERROR_EVENT_CODE_TAKEN: "This code is unavailable. Please choose another.",
  ERROR_EVENT_RANGE_INVALID: "Please select a valid date/time range.",

  // success messages
  SUCCESS_EMAIL_SENT: "Email resent. Please check your inbox.",
  SUCCESS_PASSWORD_RESET: "Password has been reset successfully.",
  SUCCESS_LOGOUT: "You have been logged out.",

  // copy link messages
  COPY_LINK_SUCCESS: "Link copied to clipboard!.",
  COPY_LINK_FAILURE: "Failed to copy link. Please try again.",
};
