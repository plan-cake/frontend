import { TrashIcon } from "@radix-ui/react-icons";

import { ConfirmationDialog } from "@/features/system-feedback";
import { cn } from "@/lib/utils/classname";

export default function ParticipantChip({
  person,
  index,
  isAvailable,
  isRemoving,
  onRemove,
}: {
  person: string;
  index: number;
  isAvailable: boolean;
  isRemoving: boolean;
  onRemove: () => Promise<boolean>;
}) {
  //  delay based on index
  const delay = (index % 4) * -0.1;

  return (
    <ConfirmationDialog
      type="delete"
      title="Remove Participant"
      description={
        <span>
          Are you sure you want to remove{" "}
          <span className="font-bold">{person}</span>?
        </span>
      }
      onConfirm={onRemove}
      disabled={!isRemoving}
    >
      <li
        style={{ animationDelay: `${delay}s` }}
        className={cn(
          "relative flex w-fit items-center justify-center rounded-full px-3 py-1 text-sm font-bold transition-all duration-200",
          // Availability Logic
          !isAvailable && "bg-gray-200/25 line-through opacity-50",
          isAvailable && "bg-lion text-violet opacity-100",
          // Wiggle/Remove Logic
          isRemoving &&
            "animate-wiggle hover:bg-red group scale-105 hover:cursor-pointer hover:text-white hover:opacity-100 active:bg-red-400 md:scale-100",
        )}
      >
        <span className="transition-opacity duration-200 group-hover:opacity-0">
          {person}
        </span>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <TrashIcon className="h-4 w-4" />
        </div>
      </li>
    </ConfirmationDialog>
  );
}
