import { headers } from "next/headers";

import { ClinicDashboardScreen } from "@/components/clinics/clinic-dashboard-screen";
import { getRenderTime } from "@/server/rendering/get-render-time";

export default async function ClinicHomePage() {
  const [refreshedAt, headersList] = await Promise.all([
    getRenderTime(),
    headers(),
  ]);

  const host = headersList.get("host") ?? "";
  const protocol = headersList.get("x-forwarded-proto") ?? "https";

  return (
    <ClinicDashboardScreen
      refreshedAt={refreshedAt}
      origin={`${protocol}://${host}`}
    />
  );
}
