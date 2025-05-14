import CustomSelect from "./custom-select";
import { fromZonedTime } from "date-fns-tz";

type TimeDropdownProps = {
  onChange: (time: Date) => void;
  value: Date | null | undefined;
  defaultTZ: string;
  duration: number;
};

export default function TimeDropdown({
  onChange,
  value,
  defaultTZ,
  duration,
}: TimeDropdownProps) {
  const options = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? "am" : "pm";
    return { label: `${hour} ${period}`, value: i };
  });

  const handleValueChange = (selectedValue: string | number) => {
    const hour = Number(selectedValue);

    const zonedSelectedTime = new Date();
    zonedSelectedTime.setHours(hour, 0, 0, 0);
    onChange(fromZonedTime(zonedSelectedTime, defaultTZ));
  };

  // Format current `value` to match an option like "2 pm"
  const formattedValue = (() => {
    if (!value) return "";
    const hour = value.getHours();
    return hour;
    // const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    // const period = hour < 12 ? "am" : "pm";
    // return `${displayHour} ${period}`;
  })();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CustomSelect
          options={options}
          value={value ? value.getHours() : ""}
          onValueChange={handleValueChange}
        />
      </div>
    </div>
  );
}

//   const options = Array.from({ length: Math.ceil(1440 / duration) }, (_, i) => {
//     const totalMinutes = i * duration;
//     const hours = Math.floor(totalMinutes / 60);
//     const minutes = totalMinutes % 60;
//     const hour = hours % 12 === 0 ? 12 : hours % 12;
//     const period = hours < 12 ? "am" : "pm";
//     const label = `${hour}:${minutes.toString().padStart(2, "0")} ${period}`;
//     return { label, value: totalMinutes };
//   });

//   const dateToMinutes = (date: Date, duration: number) => {
//     const totalMinutes = date.getHours() * 60 + date.getMinutes();
//     return Math.ceil(totalMinutes / duration) * duration;
//   };

//   const handleValueChange = (selectedValue: string | number) => {
//     const totalMinutes = Number(selectedValue);
//     const hour = Math.floor(totalMinutes / 60);
//     const minutes = totalMinutes % 60;

//     const zonedSelectedTime = new Date();
//     zonedSelectedTime.setHours(hour, minutes, 0, 0);
//     onChange(fromZonedTime(zonedSelectedTime, defaultTZ));
//   };

//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-2">
//         <CustomSelect
//           options={options}
//           value={dateToMinutes(value ?? new Date(), duration)}
//           onValueChange={handleValueChange}
//         />
//       </div>
//     </div>
//   );
// }
