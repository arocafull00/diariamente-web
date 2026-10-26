import { ClerkFailed } from "@clerk/nextjs";

import { AppSessionGate } from "@/components/app-shell/app-session-gate";
import { OfflineNotice } from "@/components/pwa/offline-notice";
import { RealtimeRefresh } from "@/components/pwa/realtime-refresh";
import { ReloadOnReconnect } from "@/components/pwa/reload-on-reconnect";
import { getRenderTime } from "@/server/rendering/get-render-time";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RealtimeRefresh />
      <OfflineNotice />
      <ClerkFailed>
        <ReloadOnReconnect />
      </ClerkFailed>
      <AppSessionGate refreshedAt={await getRenderTime()}>
        {children}
      </AppSessionGate>
    </>
  );
}
