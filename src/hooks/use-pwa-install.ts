"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallNavigator = Navigator & {
  standalone?: boolean;
  getInstalledRelatedApps?: () => Promise<{ platform: string; url?: string }[]>;
};

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as InstallNavigator).standalone === true
  );
}

function subscribeToStandalone(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

export function usePwaInstall() {
  const standalone = useSyncExternalStore(
    subscribeToStandalone,
    isStandalone,
    () => false,
  );
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      active = false;
      setInstalled(false);
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      active = false;
      setInstalled(true);
      setDeferredPrompt(null);
    }

    async function checkInstalledApp() {
      try {
        const apps = await (
          navigator as InstallNavigator
        ).getInstalledRelatedApps?.();

        if (!active) {
          return;
        }

        const manifestUrl = new URL("/manifest.webmanifest", location.origin).href;
        setInstalled(
          apps?.some(
            (app) => app.platform === "webapp" && app.url === manifestUrl,
          ) ?? false,
        );
      } catch {
        return;
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    void checkInstalledApp();

    return () => {
      active = false;
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (standalone || installed || loading) {
      return;
    }

    if (deferredPrompt) {
      setLoading(true);

      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          setInstalled(true);
          toast.success("App instalada");
        }
      } catch {
        toast.error("No se pudo instalar la app");
      } finally {
        setDeferredPrompt(null);
        setLoading(false);
      }

      return;
    }

    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      toast.info(
        "En Safari, pulsa Compartir y elige «Añadir a pantalla de inicio».",
        { duration: 6000 },
      );
      return;
    }

    toast.info(
      "Abre el menú de tu navegador y elige «Instalar aplicación» o «Añadir a pantalla de inicio». Si no aparece, abre DiariaMente en Chrome.",
      { duration: 8000 },
    );
  }

  return { installed: standalone || installed, loading, handleInstall };
}
