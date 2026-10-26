"use client";

import { useEffect } from "react";

export function ReloadOnReconnect() {
  useEffect(() => {
    function reload() {
      window.location.reload();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible" && navigator.onLine) {
        reload();
      }
    }

    window.addEventListener("online", reload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("online", reload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
