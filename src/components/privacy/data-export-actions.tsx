"use client";

import { ArrowLeft, Printer } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function DataExportActions() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      <Button variant="outline" size="lg" onClick={() => router.back()}>
        <ArrowLeft data-icon="inline-start" aria-hidden="true" />
        Volver
      </Button>
      <Button size="lg" onClick={() => window.print()}>
        <Printer data-icon="inline-start" aria-hidden="true" />
        Guardar como PDF
      </Button>
    </div>
  );
}
