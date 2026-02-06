import { useState } from "react";

import {
  EyeNoneIcon,
  EyeOpenIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils/classname";

type FieldType = "text" | "email" | "password";

type TextInputFieldProps = {
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
  } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value.length > 0;

  // determine input type
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={cn("relative mb-4 w-full", classname)}>
      {/* --- input field --- */}
      <input
        id={id}
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        placeholder=" " // triggers placeholder-shown state for floating label
        className={cn(
          "text-foreground peer w-full rounded-full bg-transparent py-2 focus:outline-none",
          outlined ? "px-5" : "border-b-1 px-2",
          isPassword && "pr-10",

          // borders and colors
          error
            ? "border-error text-error" // error
            : "border-foreground", // default
        )}
      />
      {/* --- floating label --- */}
      <label
        htmlFor={id}
        className={cn(
          "absolute origin-[0_0] cursor-text px-2",
          "transition-[top,scale] duration-300 ease-in-out",
          outlined ? "left-4" : "left-1",
          classname,

          // --- Floating Animation ---
          // State when placeholder is shown (input is empty)
          "peer-placeholder-shown:top-2 peer-placeholder-shown:scale-100",

          // State when floated (on focus or when value exists)
          "peer-focus:top-[-0.55rem] peer-focus:scale-75",
          "peer-[:not(:placeholder-shown)]:top-[-0.55rem] peer-[:not(:placeholder-shown)]:scale-75",
          "peer-[:autofill]:top-[-0.55rem] peer-[:autofill]:scale-75",

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

      {outlined && (
        <fieldset
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-10 h-full rounded-full border bg-transparent transition-[border]",
            "peer-[:autofill]:[&>legend]:w-auto peer-[:autofill]:[&>legend]:max-w-full",
            // Border Colors
            error ? "border-error" : "border-foreground",
            isFocused &&
              (error ? "border-error border-2" : "border-foreground border-2"),
          )}
        >
          <legend
            className={cn(
              "invisible ml-4 h-0 overflow-hidden transition-[width] duration-300",
              isFloating ? "w-auto" : "w-0",
            )}
          >
            <span className="px-1 text-xs font-medium">
              {error ? error : label}
            </span>
            {error && <span className="inline-block w-4" />}
          </legend>
        </fieldset>
      )}

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
  );
}
