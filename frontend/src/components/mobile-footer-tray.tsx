import { ButtonArray } from "@/features/button/button-array";

export default function MobileFooterTray({
  buttons,
}: {
  buttons: ButtonArray;
}) {
  return (
    <div className="fixed bottom-1 left-0 flex w-full justify-center px-8 md:hidden">
      <div className="frosted-glass flex justify-center gap-2 rounded-full p-2">
        {buttons.map((button, index) => (
          <div key={index}>{button}</div>
        ))}
      </div>
    </div>
  );
}
