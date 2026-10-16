"use client";

import { ChevronDown, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { BodyFigureOption } from "@/components/records/body-figure-option";
import { BodySensationsHeader } from "@/components/records/body-sensations-header";
import { Button } from "@/components/ui/button";
import type { BodyFigure } from "@/db/schema";
import { BODY_FIGURE_OPTIONS } from "@/lib/body-figures";

type BodyFigurePickerProps = {
  current: BodyFigure | null;
  pending: boolean;
  onSave: (figure: BodyFigure) => void;
  onClose: () => void;
};

export function BodyFigurePicker({ current, pending, onSave, onClose }: BodyFigurePickerProps) {
  const [selected, setSelected] = useState(current);

  return (
    <div className="flex h-full flex-col">
      <BodySensationsHeader
        title="Seleccionar figura"
        leading={{ icon: ChevronDown, label: "Cerrar", onClick: onClose }}
      />
      <div
        role="radiogroup"
        aria-label="Figura del cuerpo"
        className="mx-auto flex min-h-0 w-full max-w-lg flex-1 items-stretch gap-4 px-6"
      >
        {BODY_FIGURE_OPTIONS.map((option) => (
          <BodyFigureOption
            key={option.id}
            figure={option.id}
            label={option.label}
            selected={selected === option.id}
            onSelect={() => setSelected(option.id)}
          />
        ))}
      </div>
      <div className="mx-auto w-full max-w-lg px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Button
          size="lg"
          className="w-full"
          disabled={!selected || pending}
          onClick={() => {
            if (selected) {
              onSave(selected);
            }
          }}
        >
          {pending ? (
            <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
          ) : null}
          Guardar
        </Button>
      </div>
    </div>
  );
}
