type ParticipantRowProps = {
  participants: string[];
};

export default function ParticipantRow({ participants }: ParticipantRowProps) {
  return (
    <div className="mt-1.5 flex gap-1 text-sm">
      {participants.length > 0 ? (
        participants.map((participant) => (
          <div
            className="bg-foreground text-background flex h-6 w-6 items-center justify-center rounded-full font-bold"
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
