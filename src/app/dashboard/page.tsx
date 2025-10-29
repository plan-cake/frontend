import ClientPage from "@/app/dashboard/page-client";
import { fetchDashboard } from "@/features/dashboard/fetch-data";
import { getAuthCookieString } from "@/lib/utils/api/cookie-utils";
import { processDashboardData } from "@/lib/utils/api/process-dashboard-data";

export default async function Page() {
  const authCookies = await getAuthCookieString();

  const eventData = await fetchDashboard(authCookies);
  const processedData = processDashboardData(eventData);

  return <ClientPage {...processedData} />;
}
