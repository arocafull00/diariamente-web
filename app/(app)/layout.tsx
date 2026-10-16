import { AppSessionGate } from "@/components/app-shell/app-session-gate";
import { RealtimeRefresh } from "@/components/pwa/realtime-refresh";
import { getRenderTime } from "@/server/rendering/get-render-time";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RealtimeRefresh />
      <AppSessionGate refreshedAt={await getRenderTime()}>
        {children}
      </AppSessionGate>
    </>
  );
}
