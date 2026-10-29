import { House } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Face } from "@/components/faces/face";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Página no encontrada · Diariamente",
  description: "La página que buscas no existe o se ha movido.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-1 flex-col items-center justify-center px-6 text-center">
      <Face
        faceId="tristeza"
        size={128}
        priority
        className="mb-6 size-28 -rotate-6 drop-shadow-sm motion-safe:animate-mood-float"
      />
      <h1 className="font-display text-3xl font-medium">
        Aquí no hay nada
      </h1>
      <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
        La página que buscas no existe o se ha movido.
      </p>
      <Link href="/" data-cuelume-tap="" className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
        <House data-icon="inline-start" aria-hidden="true" />
        Volver al inicio
      </Link>
    </div>
  );
}
