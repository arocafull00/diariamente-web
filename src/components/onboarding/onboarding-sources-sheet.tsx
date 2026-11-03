"use client";

import { Illustration } from "@/components/faces/illustration";
import type { ScienceFinding } from "@/components/onboarding/onboarding-content";
import { OnboardingSourceCitation } from "@/components/onboarding/onboarding-source-citation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type OnboardingSourcesSheetProps = {
  findings: readonly ScienceFinding[];
};

export function OnboardingSourcesSheet({ findings }: OnboardingSourcesSheetProps) {
  return (
    <Sheet>
      <SheetTrigger className="mx-auto inline-flex items-center gap-2 rounded-full bg-mood-lu-soft px-4 py-2 text-sm font-bold text-mood-lu-strong outline-none transition-transform focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95">
        <Illustration name="registros" className="size-6" />
        Ver las fuentes
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col gap-0 bg-background sm:max-w-md">
        <SheetHeader className="px-5 pt-6 pb-4">
          <SheetTitle className="text-2xl font-bold tracking-tight">De dónde sale esto</SheetTitle>
          <SheetDescription>
            Estudios publicados en revistas científicas con revisión por pares.
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-6">
          <ul className="divide-y divide-border/70 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xs">
            {findings.map((finding) => (
              <OnboardingSourceCitation key={finding.id} finding={finding} />
            ))}
          </ul>
          <p className="px-1 text-sm text-muted-foreground">
            Diariamente acompaña la terapia, no la sustituye.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
