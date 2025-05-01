type TimeDropdownProps = {
  onChange?: (time: Date) => void;
  value?: Date | null | undefined;
};

export default function TimeDropdown({ onChange, value }: TimeDropdownProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <select
          id="time"
          value={value?.getHours() ?? ""}
          onChange={(e) => {
            const selectedTime = new Date();
            selectedTime.setHours(Number(e.target.value), 0, 0, 0);
            if (onChange) {
              onChange(selectedTime);
            }
          }}
          className="text-md w-[150px] rounded-md border-1 border-gray-300 p-2 focus:outline-none"
        >
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i % 12 === 0 ? 12 : i % 12;
            const period = i < 12 ? "am" : "pm";
            return (
              <option key={i} value={i}>
                {hour.toString()} {period}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
