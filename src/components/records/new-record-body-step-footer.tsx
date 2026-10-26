"use client";

import { NewRecordNextButton } from "@/components/records/new-record-next-button";
import { Button } from "@/components/ui/button";

type NewRecordBodyStepFooterProps = {
  hasSensations: boolean;
  onContinue: () => void;
};

export function NewRecordBodyStepFooter({
  hasSensations,
  onContinue,
}: NewRecordBodyStepFooterProps) {
  return (
    <div className="space-y-4">
      {hasSensations && (
        <p className="mx-auto max-w-xs text-center text-sm text-balance text-muted-foreground">
          Puedes tocar otra zona para añadir más sensaciones.
        </p>
      )}
      <div className="flex items-center justify-between gap-4">
        {hasSensations ? (
          <span aria-hidden="true" />
        ) : (
          <Button variant="ghost" size="lg" onClick={onContinue}>
            Saltar
          </Button>
        )}
        <NewRecordNextButton onClick={onContinue} label="Siguiente" />
      </div>
    </div>
  );
}
