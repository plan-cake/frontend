import { useState } from "react";

import {
  EyeNoneIcon,
  EyeOpenIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import PasswordCriteria from "@/features/auth/components/password-criteria";
import { cn } from "@/lib/utils/classname";

type FieldType = "text" | "email" | "password";

export type TextInputFieldProps = {
  id: string;
  type: FieldType;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  outlined?: boolean;
  error?: string;
  classname?: string;
  showPasswordCriteria?: boolean;
  passwordCriteria?: { [key: string]: boolean };
};

export default function TextInputField(props: TextInputFieldProps) {
  const {
    id,
    type,
    label,
    value,
    onChange,
    onFocus,
    onBlur,
    error,
    outlined,
    classname,
    showPasswordCriteria = false,
    passwordCriteria = {},
  } = props;
  const [showPassword, setShowPassword] = useState(false);

  // determine input type
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`w-full ${classname || ""}`}>
      <div className="relative w-full">
        {/* --- input field --- */}
        <input
          type={inputType}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder=" " // triggers placeholder-shown state for floating label
          className={cn(
            "peer w-full bg-transparent py-2",
            "focus:outline-none",
            outlined ? "rounded-full border px-4" : "border-b-1 px-2",
            isPassword && "pr-10",

            // borders and colors
            error
              ? "border-error text-error" // error
              : "border-foreground", // default

            // focus states
            outlined
              ? "focus:border-transparent focus:ring-2"
              : "focus:ring-none",
            error
              ? "focus:ring-error" // error
              : "focus:ring-foreground", // default
          )}
        />

        {/* --- floating label --- */}
        <label
          htmlFor={id}
          className={cn(
            "absolute origin-[0_0] cursor-text px-1",
            "transition-[top,scale] duration-200 ease-in-out",
            outlined ? "left-4" : "left-1",
            classname,

            // --- Floating Animation ---
            // State when placeholder is shown (input is empty)
            "peer-placeholder-shown:top-2.5 peer-placeholder-shown:scale-100",

            // State when floated (on focus or when value exists)
            "peer-focus:top-[-0.65rem] peer-focus:scale-75",
            "peer-[:not(:placeholder-shown)]:top-[-0.65rem] peer-[:not(:placeholder-shown)]:scale-75",
            "peer-focus:bg-background peer-[:not(:placeholder-shown)]:bg-background",
            outlined
              ? ""
              : "peer-focus:top-[-1rem] peer-[:not(:placeholder-shown)]:top-[-1rem]",

            // colors
            error
              ? "text-error" // error
              : "text-foreground/50", // default
          )}
        >
          {error ? (
            <span className="flex items-center gap-1">
              <ExclamationTriangleIcon
                className={`${classname}`}
                aria-hidden="true"
              />
              {error}
            </span>
          ) : (
            label
          )}
        </label>

        {/* --- trailing icon --- */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? (
              <EyeOpenIcon className="h-5 w-5" />
            ) : (
              <EyeNoneIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Password Criteria */}
      {showPasswordCriteria && (
        <div className="mt-2 w-full px-4">
          <PasswordCriteria criteria={passwordCriteria} />
        </div>
      )}
    </div>
  );
}
