import { HeartHandshake } from "lucide-react";

type HomePsychologistPanelProps = {
  name: string;
};

export function HomePsychologistPanel({ name }: HomePsychologistPanelProps) {
  return (
    <section className="rounded-xl bg-card p-4 shadow-sm lg:rounded-2xl lg:border lg:border-border lg:p-5 lg:shadow-none">
      <div className="hidden items-center justify-between lg:flex">
        <h3 className="font-semibold">Tu profesional</h3>
        <span className="rounded-full bg-intensity-low px-2.5 py-1 text-xs font-medium text-intensity-low-foreground">
          Vinculado
        </span>
      </div>
      <div className="flex items-center gap-3 lg:mt-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary lg:size-11 lg:rounded-full">
          <HeartHandshake className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground lg:hidden">
            Profesional vinculado
          </p>
          <p className="truncate font-semibold">{name}</p>
          <p className="hidden text-sm text-muted-foreground lg:block">
            Psicólogo asignado
          </p>
        </div>
      </div>
    </section>
  );
}
