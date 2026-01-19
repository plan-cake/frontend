import { Metadata } from "next";

import EventEditor from "@/features/event/editor/editor";

export function generateMetadata(): Metadata {
  return {
    title: "New Event • Plancake",
    openGraph: {
      title: "New Event",
      description: "Create a new event on Plancake",
    },
  };
}

export default function Page() {
  return <EventEditor type="new" />;
}
