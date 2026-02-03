import { Metadata } from "next";

import ClientPage from "@/app/version-history/page-client";
import { getVersionHistoryData } from "@/features/version-history/data";

export function generateMetadata(): Metadata {
  return {
    title: "Version History • Plancake",
    openGraph: {
      title: "Version History • Plancake",
      description:
        'Some might just call this page a "version history", but they don\'t understand the passion and determination we have here at Plancake Industries. Witness the fabled history of the legendary event planning platform, with a detailed recounting of the journey we embarked on to bring Plancake to the world.',
    },
  };
}

export default function Page() {
  return <ClientPage versionHistoryData={getVersionHistoryData()} />;
}
