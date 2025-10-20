import CustomSelect from "@/app/ui/components/selectors/custom-select";

type TimeDropdownProps = {
  id: string;
  onChange: (time: number) => void;
  value: number;
  defaultTZ: string;
  duration: number;
};

export default function TimeDropdown({
  onChange,
  value,
  id,
}: TimeDropdownProps) {
  const options = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? "am" : "pm";
    return { label: `${hour}:00 ${period}`, value: i };
  });

  options.push({ label: "12:00 am", value: 24 });

  const handleValueChange = (selectedValue: string | number) => {
    const hour = Number(selectedValue);
    onChange(hour);
  };

  return (
    <CustomSelect
      id={id}
      options={options}
      value={value}
      onValueChange={handleValueChange}
      className="h-fit w-fit"
    />
  );
}
