"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function GlobalError({ error, unstable_retry }: GlobalErrorProps) {
  useEffect(() => {
    logger.error("app.global_error", error, { digest: error.digest });
  }, [error]);

  return (
    <html lang="es">
      <body className="flex min-h-svh flex-col items-center justify-center bg-background px-6 text-center text-foreground">
        <title>Algo ha fallado · Diariamente</title>
        <h1 className="text-2xl font-medium">Algo ha fallado</h1>
        <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
          Ha ocurrido un error inesperado. Inténtalo de nuevo.
        </p>
        <Button size="lg" className="mt-8" onClick={() => unstable_retry()}>
          <RotateCcw data-icon="inline-start" aria-hidden="true" />
          Reintentar
        </Button>
      </body>
    </html>
  );
}
