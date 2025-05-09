import CustomSelect from "../custom-select";
import DateRangeDrawer from "./date-range-drawer";
import DateRangePopover from "./date-range-popover";
import WeekdayCalendar from "../weekday-calendar";
import { DateRangeProps } from "@/app/_types/date-range-types";

import useCheckMobile from "@/app/_utils/useCheckMobile";

export default function DateRangeSelector(props: DateRangeProps) {
  const {
    rangeType = "specific",
    onChangeRangeType = () => {},
    specificRange,
    onChangeSpecific,
    weekdayRange = {},
    onChangeWeekday = () => {},
  } = props;

  const isMobile = useCheckMobile();

  const select = (
    <CustomSelect
      options={["Specific Dates", "Days of the Week"]}
      value={rangeType === "specific" ? "Specific Dates" : "Days of the Week"}
      onValueChange={(value) =>
        onChangeRangeType(value === "Specific Dates" ? "specific" : "weekday")
      }
      className="hidden min-h-9 min-w-[180px] md:flex"
    />
  );

  if (isMobile) {
    return (
      <DateRangeDrawer
        specificRange={specificRange}
        onChangeSpecific={onChangeSpecific}
        rangeType={rangeType}
        onChangeRangeType={onChangeRangeType}
        weekdayRange={weekdayRange}
        onChangeWeekday={onChangeWeekday}
      />
    );
  }

  return (
    <div className="flex flex-col space-y-2 space-x-20 md:flex-row md:pl-4">
      {select}
      {rangeType === "specific" && specificRange.from && specificRange.to ? (
        <DateRangePopover
          specificRange={specificRange}
          onChangeSpecific={onChangeSpecific}
        />
      ) : (
        <WeekdayCalendar
          selectedDays={weekdayRange}
          onChange={onChangeWeekday}
        />
      )}
    </div>
  );
}
