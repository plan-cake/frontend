import { notFound } from "next/dist/client/components/navigation";

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

export function handleErrorResponse(
  status: number,
  errors: ApiErrorResponse,
): never {
  // handle 404 separately to trigger Next.js notFound page
  if (status === 404) {
    notFound();
  }

  // stringify the server message for error
  const serverMessage = JSON.stringify(errors);
  let errorMessage = formatApiError(errors);
  console.log("Formatted API Error:", errorMessage);

  let title = "Oops! Something went wrong.";

  switch (status) {
    case 400:
      title = title;
      errorMessage =
        "It looks like your request wasn't quite right. Please double-check the information you sent and give it another try.";
      break;
    case 403:
      title = "Access Restricted";
      errorMessage =
        "Sorry, it seems you don't have permission to view this. If you think you should have access, you might want to check that you're logged into the correct account.";
      break;
    case 429:
      title = "Woah, slow down!";
      errorMessage = "You're making requests too quickly. " + errorMessage;
      break;
    case 500:
      title = "Man :(";
      errorMessage = "Something went wrong on our end. Please try again later.";
      break;
  }

  const errorDetails = {
    status: status,
    title: title,
    message: errorMessage,
  };

  // throw an error with a JSON string message to preserve structure
  throw new Error(JSON.stringify(errorDetails), {
    cause: serverMessage,
  });
}
