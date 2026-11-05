"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { useAnimate, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function HomeNewRecordButton() {
  const router = useRouter();
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const reducedMotion = useReducedMotion();
  const navigating = useRef(false);

  return (
    <Link
      href="/nuevo-registro"
      aria-label="Nuevo registro"
      data-cuelume-tap=""
      className="absolute inset-0 m-auto flex size-20 items-center justify-center rounded-full bg-card text-foreground shadow-xl ring-1 ring-border/60 outline-none transition-[scale,box-shadow] duration-300 ease-spring hover:scale-110 hover:shadow-2xl active:scale-90 active:shadow-md focus-visible:ring-4 focus-visible:ring-ring/50 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
      onNavigate={async (event) => {
        if (reducedMotion) return;

        event.preventDefault();
        if (navigating.current) return;
        navigating.current = true;

        await animate(
          scope.current,
          { rotate: [0, 180] },
          { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
        );
        router.push("/nuevo-registro");
        navigating.current = false;
      }}
    >
      <span ref={scope} className="flex" aria-hidden="true">
        <Plus className="size-8" strokeWidth={2.5} />
      </span>
    </Link>
  );
}
