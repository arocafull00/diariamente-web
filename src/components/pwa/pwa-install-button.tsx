"use client";

import { Download, LoaderCircle } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

function isIos() {
  if (typeof window === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function subscribeToStandalone(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

export function PwaInstallButton() {
  const standalone = useSyncExternalStore(
    subscribeToStandalone,
    isStandalone,
    () => false,
  );
  const ios = useSyncExternalStore(() => () => {}, isIos, () => false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (standalone) {
      return;
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [standalone]);

  async function handleInstall() {
    if (deferredPrompt) {
      setLoading(true);

      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          toast.success("App instalada");
          setDeferredPrompt(null);
        }
      } catch {
        toast.error("No se pudo instalar la app");
      } finally {
        setLoading(false);
      }

      return;
    }

    if (ios) {
      toast.info(
        "En Safari, pulsa Compartir y elige «Añadir a pantalla de inicio».",
        { duration: 6000 },
      );
      return;
    }

    toast.error("Tu navegador no permite instalar la app desde aquí");
  }

  if (standalone || installed) {
    return null;
  }

  if (!deferredPrompt && !ios) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={loading}
      onClick={handleInstall}
    >
      {loading ? (
        <LoaderCircle
          className="animate-spin"
          data-icon="inline-start"
          aria-hidden="true"
        />
      ) : (
        <Download data-icon="inline-start" aria-hidden="true" />
      )}
      {loading ? "Instalando..." : "Descargar app"}
    </Button>
  );
}
