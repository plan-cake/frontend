import { getAuthCookieString } from "../_utils/cookie-utils";
import { fetchDashboard } from "../_utils/fetch-data";
import { processDashboardData } from "../_utils/process-dashboard-data";
import DashboardPage from "../ui/layout/dashboard-page";

export default async function Page() {
  const authCookies = await getAuthCookieString();

  const eventData = await fetchDashboard(authCookies);
  const processedData = processDashboardData(eventData);

  return <DashboardPage {...processedData} />;
}
