import { getAuthCookieString } from "../_utils/cookie-utils";
import { fetchDashboard } from "../_utils/fetch-data";
import DashboardPage from "../ui/layout/dashboard-page";

export default async function Page() {
  const authCookies = await getAuthCookieString();

  const eventData = await fetchDashboard(authCookies);

  return <DashboardPage {...eventData} />;
}
