import { RecordBodySensationRow } from "@/components/records/record-body-sensation-row";
import type { BodySensation } from "@/db/schema";

type RecordBodySectionProps = {
  sensations: BodySensation[];
};

export function RecordBodySection({ sensations }: RecordBodySectionProps) {
  if (sensations.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border/60 sm:p-6">
      <h2 className="font-display text-xl font-medium">Cuerpo</h2>
      <ul className="divide-y divide-border">
        {sensations.map((sensation) => (
          <RecordBodySensationRow key={sensation.region} sensation={sensation} />
        ))}
      </ul>
    </section>
  );
}
