import Selector from "@/features/selector/components/selector";

type TimeSelectorProps = {
  id: string;
  onChange: (time: number) => void;
  value: number;
};

export default function TimeSelector({
  id,
  onChange,
  value,
}: TimeSelectorProps) {
  const options = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? "am" : "pm";
    return { label: `${hour}:00 ${period}`, value: i };
  });

  options.push({ label: "12:00 am", value: 24 });

  return (
    <Selector
      id={id}
      onChange={onChange}
      value={value}
      options={options}
      dialogTitle="Select Time"
      dialogDescription="Select a time from the list"
      className="h-fit w-fit"
    />
  );
}
