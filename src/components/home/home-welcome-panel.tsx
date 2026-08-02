import { BookOpenText, Plus } from "lucide-react";
import Link from "next/link";

type HomeWelcomePanelProps = {
  firstName: string | null;
  recordCount: number;
};

export function HomeWelcomePanel({
  firstName,
  recordCount,
}: HomeWelcomePanelProps) {
  const greeting = firstName ? `Hola, ${firstName}` : "Hola";

  return (
    <section className="relative overflow-hidden rounded-xl bg-primary p-5 text-primary-foreground shadow-sm sm:p-6 lg:rounded-3xl lg:bg-linear-to-br lg:from-brand-primary-dark lg:via-primary lg:to-brand-primary-light lg:p-8 lg:shadow-lg">
      <div
        className="pointer-events-none absolute -top-20 -right-14 hidden size-48 rounded-full bg-white/10 lg:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-20 -bottom-28 hidden size-48 rounded-full bg-white/10 lg:block"
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-balance lg:text-3xl">
            {greeting}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-pretty lg:max-w-xl lg:text-base">
            Este es tu espacio para recoger lo que ocurre entre sesiones y
            volver a ello cuando lo necesites.
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15 lg:hidden">
          <BookOpenText className="size-5" aria-hidden="true" />
        </span>
      </div>
      <div className="relative mt-5 flex flex-wrap items-center gap-3">
        <p className="inline-flex items-center rounded-full bg-primary-foreground/10 px-3 py-1.5 text-sm font-semibold">
          {recordCount}{" "}
          {recordCount === 1 ? "registro guardado" : "registros guardados"}
        </p>
        <Link
          href="/nuevo-registro"
          className="hidden items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-white/90 lg:flex"
        >
          <Plus className="size-4" aria-hidden="true" />
          Crear registro
        </Link>
      </div>
    </section>
  );
}
