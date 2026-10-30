import { RecordBodyFigure } from "@/components/records/record-body-figure";
import { RecordBodySensationRow } from "@/components/records/record-body-sensation-row";
import type { StoredBodySensation } from "@/db/schema";
import { BODY_SIDES, getSensationKey, getSensationSide } from "@/lib/body-sensations";

type RecordBodySectionProps = {
  sensations: StoredBodySensation[];
  action?: React.ReactNode;
};

export function RecordBodySection({ sensations, action }: RecordBodySectionProps) {
  if (sensations.length === 0 && !action) {
    return null;
  }

  const sides = BODY_SIDES.filter((side) =>
    sensations.some((sensation) => getSensationSide(sensation) === side),
  );

  return (
    <section className="space-y-4 rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border/60 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-medium">Cuerpo</h2>
        {action}
      </div>
      {sensations.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">Sin sensaciones registradas</p>
      ) : (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex shrink-0 justify-center gap-4">
            {sides.map((side) => (
              <RecordBodyFigure key={side} side={side} sensations={sensations} />
            ))}
          </div>
          <ul className="min-w-0 flex-1 divide-y divide-border">
            {sensations.map((sensation, index) => (
              <RecordBodySensationRow
                key={getSensationKey(sensation, index)}
                sensation={sensation}
                index={index}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
