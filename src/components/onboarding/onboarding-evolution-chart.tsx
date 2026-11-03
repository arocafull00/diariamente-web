const WITHOUT_RECORDS_PATH =
  "M8 70 C 40 30, 60 100, 92 64 S 148 28, 176 78 S 236 96, 272 58 S 300 70, 312 66";
const WITH_RECORDS_PATH = "M8 78 C 60 76, 96 66, 140 54 S 232 28, 312 16";

export function OnboardingEvolutionChart() {
  return (
    <figure className="rounded-3xl border-2 border-border bg-card px-4 pt-4 pb-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Cómo te entiendes
        </p>
        <span className="rounded-full bg-mood-hp-soft px-2.5 py-0.5 text-xs font-bold text-mood-hp-strong">
          Ejemplo
        </span>
      </div>
      <svg
        viewBox="0 0 320 100"
        role="img"
        aria-label="Ejemplo ilustrativo: registrando, la comprensión de tus emociones crece con el tiempo; sin registrar, sube y baja."
        className="mt-2 h-auto w-full overflow-visible"
      >
        <path
          d={WITHOUT_RECORDS_PATH}
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="2 7"
          className="stroke-mood-hu-3"
        />
        <path
          d={WITH_RECORDS_PATH}
          fill="none"
          strokeWidth={5}
          strokeLinecap="round"
          className="stroke-mood-lp-3"
        />
        <circle cx={312} cy={16} r={7} className="fill-mood-lp-3 stroke-card" strokeWidth={3} />
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
        <span className="inline-flex items-center gap-1.5 text-mood-lp-strong">
          <span aria-hidden="true" className="h-1.5 w-4 rounded-full bg-mood-lp-3" />
          Registrando
        </span>
        <span className="inline-flex items-center gap-1.5 text-mood-hu-strong">
          <span aria-hidden="true" className="h-1.5 w-4 rounded-full bg-mood-hu-3" />
          Solo con la memoria
        </span>
      </figcaption>
    </figure>
  );
}
