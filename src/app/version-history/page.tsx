import { Metadata } from "next";

import ClientPage from "@/app/version-history/page-client";
import { getVersionHistoryData } from "@/features/version-history/data";

export function generateMetadata(): Metadata {
  return {
    title: "Version History • Plancake",
    openGraph: {
      title: "Version History",
      description: "Here you will find some real tear-jerkers, along with intense drama and plenty of laugh-out-loud moments. This page is widely regarded as absolute cinema. Others might just call it a \"version history\", but they don't understand the passion and determination we have here at Plancake Industries. Witness the fabled history of the legendary event planning platform here, with a detailed recounting of the journey we embarked on to bring Plancake to the world.",
    },
  };
}

export default function Page() {
  return <ClientPage versionHistoryData={getVersionHistoryData()} />;
}
