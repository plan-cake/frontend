function snakeToTitleCase(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function formatApiError(errors: any): string {
  let errorMessage = "";
  let generalMessage = "";
  errors = errors.error;

  if (errors.general) {
    generalMessage = errors.general[0];
  }

  for (const field in errors) {
    if (field !== "general" && Array.isArray(errors[field])) {
      for (const msg of errors[field]) {
        const fieldTitle = snakeToTitleCase(field);
        errorMessage += `${fieldTitle}: ${msg}\n`;
      }
    }
  }

  if (errorMessage) {
    if (generalMessage) {
      return generalMessage + "\n" + errorMessage.trim();
    }
    return errorMessage.trim();
  } else if (generalMessage) {
    return generalMessage;
  }

  return "An unknown error has occurred.";
}
