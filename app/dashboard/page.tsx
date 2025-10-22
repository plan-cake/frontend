import { getAuthCookieString } from "@/app/_utils/cookie-utils";
import { fetchDashboard } from "@/app/_utils/fetch-data";
import { processDashboardData } from "@/app/_utils/process-dashboard-data";
import DashboardPage from "@/app/ui/layout/dashboard-page";

export default async function Page() {
  const authCookies = await getAuthCookieString();

  const eventData = await fetchDashboard(authCookies);
  const processedData = processDashboardData(eventData);

  return <DashboardPage {...processedData} />;
}
