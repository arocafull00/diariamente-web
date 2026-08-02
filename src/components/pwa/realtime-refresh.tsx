"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "realtime-refresh") {
        router.refresh();
      }
    }

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [router]);

  return null;
}
