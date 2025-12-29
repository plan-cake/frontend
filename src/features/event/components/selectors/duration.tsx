import Selector from "@/components/selector/selector";

const durationOptions = [
  { label: "None", value: 0 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "1 hour", value: 60 },
];

type DurationSelectorProps = {
  id: string;
  onChange: (duration: string | number) => void;
  value: number;
};

export default function DurationSelector({
  id,
  onChange,
  value,
}: DurationSelectorProps) {
  return (
    <Selector
      id={id}
      onChange={onChange}
      value={value}
      options={durationOptions}
      dialogTitle="Select Duration"
      dialogDescription="Select a duration from the list"
    />
  );
}
