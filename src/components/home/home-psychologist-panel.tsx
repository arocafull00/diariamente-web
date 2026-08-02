import { HeartHandshake } from "lucide-react";

type HomePsychologistPanelProps = {
  name: string;
};

export function HomePsychologistPanel({ name }: HomePsychologistPanelProps) {
  return (
    <section className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <HeartHandshake className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">
          Profesional vinculado
        </p>
        <p className="truncate font-semibold">{name}</p>
      </div>
    </section>
  );
}
