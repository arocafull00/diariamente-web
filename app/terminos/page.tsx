import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { LegalLinks } from "@/components/legal/legal-links";
import {
  TERMS_OF_SERVICE_SECTIONS,
  TERMS_OF_SERVICE_UPDATED_AT,
} from "@/components/legal/terms-of-service-content";
import { TermsOfServiceSection } from "@/components/legal/terms-of-service-section";

export const metadata: Metadata = {
  title: "Términos de servicio · Diariamente",
  description:
    "Condiciones de uso de Diariamente para pacientes y profesionales: cuentas, registros, vinculación, privacidad y baja del servicio.",
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-4 border-b border-border pb-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a Diariamente
        </Link>
        <h1 className="font-display text-3xl font-medium text-balance">
          Términos de servicio
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Condiciones de uso de la aplicación para pacientes y profesionales.
        </p>
        <p className="text-sm text-muted-foreground">
          Última actualización:{" "}
          <time dateTime={TERMS_OF_SERVICE_UPDATED_AT}>
            27 de octubre de 2026
          </time>
        </p>
      </header>
      {TERMS_OF_SERVICE_SECTIONS.map((section) => (
        <TermsOfServiceSection key={section.id} {...section} />
      ))}
      <footer className="border-t border-border pt-6">
        <LegalLinks />
      </footer>
    </main>
  );
}
