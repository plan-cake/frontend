import { getAuthCookieString } from "@/src/lib/utils/api/cookie-utils";
import { fetchDashboard } from "@/src/features/dashboard/fetch-data";
import { processDashboardData } from "@/src/lib/utils/api/process-dashboard-data";
import ClientPage from "@/src/app/dashboard/page-client";

export default async function Page() {
  const authCookies = await getAuthCookieString();

  const eventData = await fetchDashboard(authCookies);
  const processedData = processDashboardData(eventData);

  return <ClientPage {...processedData} />;
}
