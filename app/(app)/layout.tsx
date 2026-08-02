import { Suspense } from "react";

import { AppLayoutContent } from "@/components/app-shell/app-layout-content";
import { AppLoading } from "@/components/app-shell/app-loading";
import { RealtimeRefresh } from "@/components/pwa/realtime-refresh";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RealtimeRefresh />
      <Suspense fallback={<AppLoading />}>
        <AppLayoutContent>{children}</AppLayoutContent>
      </Suspense>
    </>
  );
}
