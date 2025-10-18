import Link from "next/link";
import HeaderSpacer from "../../ui/components/header/header-spacer";

type Event = {
  id: string;
  title: string;
  participants: string[];
};

export default async function DashboardPage({ eventData }: { eventData: any }) {
  const renderParticipants = (participants: string[]) => {
    const visible = participants.slice(0, 4);
    const extraCount = participants.length - visible.length;

    return (
      <>
        {visible.map((p, i) => (
          <div
            key={i}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs"
          >
            {p}
          </div>
        ))}
        {extraCount > 0 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-xs text-white">
            +{extraCount}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <HeaderSpacer />
      {/* Events You Joined */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Events You Joined</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {eventData.participated_events.map((event: any) => (
            <div key={event.id} className="flex flex-col items-center">
              <Link
                href={`/${event.id}`}
                className="flex h-40 w-full flex-col justify-end rounded-lg bg-gray-200 p-4 text-black shadow transition hover:shadow-lg"
              >
                <div className="flex gap-1">
                  {renderParticipants(event.participants)}
                </div>
              </Link>
              <Link href={`/${event.id}`}>
                <h3 className="mt-2 text-center font-semibold">
                  {event.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Events You Created */}
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Events You Created</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {eventData.created_events.map((event: any) => (
            <div key={event.id} className="flex flex-col items-center">
              <Link
                href={`/${event.id}`}
                className="flex h-40 w-full flex-col justify-end rounded-lg bg-gray-200 p-4 text-black shadow transition hover:shadow-lg"
              >
                <div className="flex gap-1">
                  {renderParticipants(event.participants)}
                </div>
              </Link>
              <Link href={`/${event.id}`}>
                <h3 className="mt-2 text-center font-semibold">
                  {event.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
