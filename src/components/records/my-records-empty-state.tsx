import { Plus } from "lucide-react";
import Link from "next/link";

import { FaceRow } from "@/components/faces/face-row";
import { buttonVariants } from "@/components/ui/button";
import { DECORATIVE_FACE_IDS } from "@/lib/faces";
import { cn } from "@/lib/utils";

export function MyRecordsEmptyState() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-border/60">
      <div className="mb-6">
        <FaceRow faceIds={DECORATIVE_FACE_IDS.slice(1)} className="size-14" />
      </div>
      <h2 className="font-display text-2xl font-medium motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:ease-out-quart motion-safe:[animation-delay:100ms]">
        Tu espacio está listo
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:ease-out-quart motion-safe:[animation-delay:200ms]">
        Cuenta cómo te sientes y aquí irás viendo todo tu recorrido. ¡Empieza cuando quieras!
      </p>
      <Link
        href="/nuevo-registro"
        data-cuelume-tap=""
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-6 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:ease-spring motion-safe:[animation-delay:320ms]",
        )}
      >
        <Plus data-icon="inline-start" aria-hidden="true" />
        Crear mi primer registro
      </Link>
    </section>
  );
}
