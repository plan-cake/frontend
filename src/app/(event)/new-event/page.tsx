import { Metadata } from "next";

import EventEditor from "@/features/event/editor/editor";
import { constructMetadata } from "@/lib/utils/construct-metadata";

export function generateMetadata(): Metadata {
  return constructMetadata("New Event", "Create a new event on Plancake!");
}

export default function Page() {
  return <EventEditor type="new" />;
}
