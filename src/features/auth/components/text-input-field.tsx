import { useState } from "react";

import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";

type FieldType = "text" | "email" | "password";

type TextInputFieldProps = {
  type: FieldType;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function TextInputField(props: TextInputFieldProps) {
  const { type, placeholder, value, onChange, onFocus, onBlur } = props;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative mb-4 flex w-full flex-row items-center">
      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className={
          "w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2" +
          (type === "password" ? " pr-10" : "")
        }
      />
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 cursor-pointer"
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
