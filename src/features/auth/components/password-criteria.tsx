import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils/classname";

type PasswordCriteriaProps = {
  criteria: { [key: string]: boolean };
};

export default function PasswordCriteria(props: PasswordCriteriaProps) {
  return (
    <div className="w-full text-sm">
      <b>Your password must:</b>
      {Object.entries(props.criteria).map(([key, value], index) => (
        <div
          key={index}
          className={cn(
            "flex items-center gap-1",
            value ? "line-through opacity-50" : "",
          )}
        >
          {value ? <CheckIcon /> : <Cross2Icon />}
          {key}
        </div>
      ))}
    </div>
  );
}
