import { BookOpenText } from "lucide-react";

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
    <section className="rounded-xl bg-primary p-5 text-primary-foreground shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-balance">{greeting}</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-pretty">
            Este es tu espacio para recoger lo que ocurre entre sesiones y
            volver a ello cuando lo necesites.
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
          <BookOpenText className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-5 inline-flex items-center rounded-full bg-primary-foreground/10 px-3 py-1.5 text-sm font-semibold">
        {recordCount} {recordCount === 1 ? "registro guardado" : "registros guardados"}
      </p>
    </section>
  );
}
