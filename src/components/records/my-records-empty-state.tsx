import { Plus } from "lucide-react";
import Link from "next/link";

import { MoodBubble } from "@/components/records/mood-bubble";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MyRecordsEmptyState() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-border/60">
      <div className="mx-auto mb-6 flex w-fit -space-x-3" aria-hidden="true">
        <MoodBubble quadrant="HIGH_UNPLEASANT" tone={3} className="size-12" />
        <MoodBubble quadrant="HIGH_PLEASANT" tone={3} className="size-12" />
        <MoodBubble quadrant="LOW_UNPLEASANT" tone={3} className="size-12" />
        <MoodBubble quadrant="LOW_PLEASANT" tone={3} className="size-12" />
      </div>
      <h2 className="font-display text-2xl font-medium">Tu espacio está listo</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
        Registra cómo te sientes y aquí irás viendo tu recorrido entre
        sesiones.
      </p>
      <Link
        href="/nuevo-registro"
        className={cn(buttonVariants({ size: "lg" }), "mt-6")}
      >
        <Plus data-icon="inline-start" aria-hidden="true" />
        Crear primer registro
      </Link>
    </section>
  );
}
