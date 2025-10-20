function snakeToTitleCase(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type ApiErrorResponse = {
  error: {
    [key: string]: string[];
  };
};

export default function formatApiError(errors: ApiErrorResponse): string {
  let errorMessage = "";
  let generalMessage = "";
  const errorFields = errors.error;

  if (errorFields.general) {
    generalMessage = errorFields.general[0];
  }

  for (const field in errorFields) {
    if (field !== "general" && Array.isArray(errorFields[field])) {
      for (const msg of errorFields[field]) {
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
