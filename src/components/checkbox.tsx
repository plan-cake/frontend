type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function Checkbox(props: CheckboxProps) {
  const { label, checked, onChange } = props;
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="confirm"
        className="checked:border-accent checked:bg-accent peer h-4 w-4 appearance-none rounded-sm border border-gray-300"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor="confirm" className="peer-checked:text-accent text-sm">
        {label}
      </label>
    </div>
  );
}
