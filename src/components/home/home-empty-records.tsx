import { Plus } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeEmptyRecords() {
  return (
    <section className="rounded-xl bg-secondary p-5 shadow-sm">
      <h2 className="font-semibold text-balance">
        Empieza por algo que haya ocurrido hoy
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground text-pretty">
        Puedes anotar la situación, lo que pensaste, cómo actuaste y qué
        emociones aparecieron.
      </p>
      <Link
        href="/nuevo-registro"
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-4 w-full rounded-xl sm:w-auto",
        )}
      >
        <Plus data-icon="inline-start" aria-hidden="true" />
        Crear primer registro
      </Link>
    </section>
  );
}
