"use client";

import { WifiOff } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { useOnlineStatus } from "@/hooks/use-online-status";

const OFFLINE_TOAST_ID = "offline";

export function OfflineNotice() {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (isOnline) {
      toast.dismiss(OFFLINE_TOAST_ID);
      return;
    }

    toast("Sin conexión", {
      id: OFFLINE_TOAST_ID,
      description:
        "Te enseñamos lo último que guardaste. Lo actualizamos en cuanto vuelvas a tener conexión.",
      icon: <WifiOff className="size-4" aria-hidden="true" />,
    });
  }, [isOnline]);

  return null;
}
