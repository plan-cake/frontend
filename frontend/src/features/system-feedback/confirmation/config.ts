import {
  ExclamationTriangleIcon,
  CheckIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

export const DIALOG_CONFIG = {
  warning: {
    icon: null, // special case for the text "!"
    bgClass: "bg-lion",
    btnStyle: "primary",
    isTextIcon: true,
  },
  delete: {
    icon: ExclamationTriangleIcon,
    bgClass: "bg-error/40",
    btnStyle: "danger",
    isTextIcon: false,
  },
  success: {
    icon: CheckIcon,
    bgClass: "bg-foreground/40",
    btnStyle: "primary",
    isTextIcon: false,
  },
  error: {
    icon: ExclamationTriangleIcon,
    bgClass: "bg-error/40",
    btnStyle: "danger",
    isTextIcon: false,
  },
  info: {
    icon: InfoCircledIcon,
    bgClass: "bg-blue/40",
    btnStyle: "primary",
    isTextIcon: false,
  },
} as const;
