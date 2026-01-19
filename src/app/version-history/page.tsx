import { Metadata } from "next";

import ClientPage from "@/app/version-history/page-client";
import { getVersionHistoryData } from "@/features/version-history/data";

export function generateMetadata(): Metadata {
  return {
    title: "Version History • Plancake",
    openGraph: {
      title: "Version History",
      description: "View the version history of Plancake",
    },
  };
}

export default function Page() {
  return <ClientPage versionHistoryData={getVersionHistoryData()} />;
}
