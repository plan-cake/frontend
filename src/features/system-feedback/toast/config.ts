import {
  CheckIcon,
  CopyIcon,
  InfoCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

export const TOAST_CONFIG = {
  error: {
    icon: ExclamationTriangleIcon,
    style: "bg-red",
    title: "ERROR",
  },
  copy: {
    icon: CopyIcon,
    style: "bg-foreground text-background",
    title: "COPIED",
  },
  success: {
    icon: CheckIcon,
    style: "bg-foreground text-background",
    title: "SUCCESS",
  },
  info: {
    icon: InfoCircledIcon,
    style: "bg-blue",
    title: "INFORMATION",
  },
} as const;
