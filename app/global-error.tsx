"use client";

import { LogOut, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";
import { signOutAndLeave } from "@/lib/sign-out";

import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

type WindowWithClerk = Window & {
  Clerk?: { session?: unknown; signOut: () => Promise<unknown> };
};

export default function GlobalError({ error, unstable_retry }: GlobalErrorProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    logger.error("app.global_error", error, { digest: error.digest });
  }, [error]);

  function signOut() {
    setLeaving(true);
    const clerk = (window as WindowWithClerk).Clerk;
    void signOutAndLeave(clerk?.session ? () => clerk.signOut() : null);
  }

  return (
    <html lang="es">
      <body className="flex min-h-svh flex-col items-center justify-center bg-background px-6 text-center text-foreground">
        <title>Algo ha fallado · Diariamente</title>
        <h1 className="text-2xl font-medium">¡Ups! Algo ha fallado</h1>
        <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
          No sabemos muy bien qué ha pasado. ¿Lo intentamos otra vez?
        </p>
        <Button size="lg" className="mt-8" onClick={() => unstable_retry()}>
          <RotateCcw data-icon="inline-start" aria-hidden="true" />
          Reintentar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 text-muted-foreground"
          disabled={leaving}
          onClick={signOut}
        >
          <LogOut data-icon="inline-start" aria-hidden="true" />
          Cerrar sesión
        </Button>
      </body>
    </html>
  );
}
