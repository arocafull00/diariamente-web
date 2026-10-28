import type { Metadata } from "next";

import { TermsAcceptanceForm } from "@/components/legal/terms-acceptance-form";
import { requireProfile } from "@/server/auth/get-current-profile";

export const metadata: Metadata = {
  title: "Aceptar términos",
};

export default async function AcceptTermsPage() {
  await requireProfile();

  return (
    <div className="flex min-h-svh flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-5 py-[max(1.25rem,env(safe-area-inset-top))] sm:px-8">
        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Antes de continuar
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            Para seguir usando DiariaMente necesitamos que aceptes los términos
            de servicio y la política de privacidad.
          </p>
        </div>
        <TermsAcceptanceForm />
      </main>
    </div>
  );
}
