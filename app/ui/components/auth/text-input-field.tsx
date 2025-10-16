import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";

type FieldType = "text" | "email" | "password";

type TextInputFieldProps = {
  type: FieldType;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export default function TextInputField(props: TextInputFieldProps) {
  const { type, placeholder, value, onChange } = props;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative mb-4 flex w-full flex-row items-center">
      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={
          "w-full rounded-full border px-4 py-2 focus:ring-2 focus:outline-none" +
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
