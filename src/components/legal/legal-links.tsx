import Link from "next/link";

import { PRIVACY_POLICY_PATH } from "@/lib/privacy";

export function LegalLinks() {
  return (
    <nav
      aria-label="Información legal"
      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
    >
      <Link
        href="/terminos"
        className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        Términos de servicio
      </Link>
      <Link
        href={PRIVACY_POLICY_PATH}
        className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        Política de privacidad
      </Link>
    </nav>
  );
}
