import { cn } from "@/lib/utils/classname";

type ParticipantRowProps = {
  participants: string[];
  maxDisplay: number;
};

export default function ParticipantRow({
  participants,
  maxDisplay,
}: ParticipantRowProps) {
  return (
    <div className="mt-1.5 flex text-sm">
      {participants.length > 0 ? (
        participants.map((participant, index) => {
          if (index >= maxDisplay) {
            if (index === maxDisplay) {
              return (
                <ParticipantIcon
                  key="more-participants"
                  iconText={`+${participants.length - maxDisplay}`}
                  isFirst={false}
                />
              );
            }
            return null;
          }
          return (
            <ParticipantIcon
              key={participant}
              iconText={participant.charAt(0).toUpperCase()}
              isFirst={index === 0}
            />
          );
        })
      ) : (
        <div className="text-sm italic opacity-50">No attendees yet</div>
      )}
    </div>
  );
}

function ParticipantIcon({
  iconText,
  isFirst,
}: {
  iconText: string;
  isFirst: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-foreground text-background flex h-6 min-w-6 items-center justify-center rounded-full px-1 font-bold",
        !isFirst && "outline-background -ml-1 outline-2",
      )}
    >
      {iconText}
    </div>
  );
}
