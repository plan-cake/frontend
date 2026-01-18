import { Metadata } from "next";

import ClientPage from "@/app/version-history/page-client";
import { getVersionHistoryData } from "@/features/version-history/data";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Version History • Plancake",
    openGraph: {
      title: "Version History",
      description: "View the version history of Plancake",
    },
  };
}

export default async function Page() {
  return <ClientPage versionHistoryData={getVersionHistoryData()} />;
}
