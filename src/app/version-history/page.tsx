import ClientPage from "@/app/version-history/page-client";
import { getVersionHistoryData } from "@/features/version-history/data";

export default async function Page() {
  return <ClientPage versionHistoryData={getVersionHistoryData()} />;
}
