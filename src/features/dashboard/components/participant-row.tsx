import { cn } from "@/lib/utils/classname";

type ParticipantRowProps = {
  participants: string[];
};

export default function ParticipantRow({ participants }: ParticipantRowProps) {
  return (
    <div className="mt-1.5 flex gap-1 text-sm">
      {participants.length > 0 ? (
        participants.map((participant, index) => (
          <div
            className={cn(
              "bg-foreground text-background flex h-6 w-6 items-center justify-center rounded-full font-bold",
              index > 0 && "outline-background -ml-2 outline-2",
            )}
            key={participant}
          >
            {participant.charAt(0).toUpperCase()}
          </div>
        ))
      ) : (
        <div className="text-sm italic opacity-50">No attendees yet</div>
      )}
    </div>
  );
}
