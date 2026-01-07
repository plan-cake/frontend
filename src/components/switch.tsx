import * as RadixSwitch from "@radix-ui/react-switch";

type SwitchProps = {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

export default function Switch({
  id,
  checked,
  onCheckedChange,
  disabled = false,
}: SwitchProps) {
  return (
    <RadixSwitch.Root
      id={id}
      checked={checked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
      className="data-[state=checked]:bg-accent bg-foreground/20 relative h-[25px] w-[50px] cursor-default rounded-full shadow-inner outline-none transition-colors hover:cursor-pointer"
    >
      <RadixSwitch.Thumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px_rgba(0,0,0,0.1)] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[27px]" />
    </RadixSwitch.Root>
  );
}
