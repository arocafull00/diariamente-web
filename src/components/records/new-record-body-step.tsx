"use client";

import { Trash2, X } from "lucide-react";

import { BodyFigure } from "@/components/records/body-figure";
import { BodyFigureZoomControls } from "@/components/records/body-figure-zoom-controls";
import { BodySideToggle } from "@/components/records/body-side-toggle";
import { BodySensationChip } from "@/components/records/body-sensation-chip";
import { BodySensationEditor } from "@/components/records/body-sensation-editor";
import { BodySensationsHeader } from "@/components/records/body-sensations-header";
import { NewRecordBodyStepFooter } from "@/components/records/new-record-body-step-footer";
import { NewRecordStepTitle } from "@/components/records/new-record-step-title";
import { useBodySensationsStep } from "@/components/records/use-body-sensations-step";
import type { BodySensation } from "@/db/schema";
import { BODY_POINT_PHRASE } from "@/lib/body-sensations";

type NewRecordBodyStepProps = {
  sensations: BodySensation[];
  onSave: (sensation: BodySensation) => void;
  onRemove: (id: string) => void;
  onContinue: () => void;
};

export function NewRecordBodyStep({
  sensations,
  onSave,
  onRemove,
  onContinue,
}: NewRecordBodyStepProps) {
  const body = useBodySensationsStep({ sensations, onSave, onRemove });
  const { active } = body;
  const {
    ref,
    svgRef,
    hitPathRef,
    handlers,
    viewBox,
    markerScale,
    interacting,
    canZoomIn,
    canZoomOut,
    zoomIn,
    zoomOut,
  } = body.camera;
  const closeAction = { icon: X, label: "Volver al cuerpo", onClick: body.showOverview };
  const removeAction = { icon: Trash2, label: "Eliminar sensación", onClick: body.removeSensation };

  return (
    <div className="relative mx-auto flex h-full w-full max-w-lg flex-col">
      {active ? (
        <BodySensationsHeader
          title={BODY_POINT_PHRASE}
          actions={body.saved ? [removeAction, closeAction] : [closeAction]}
        />
      ) : (
        <NewRecordStepTitle before="¿Dónde notas una sensación física?" className="px-6" />
      )}
      <div className="relative min-h-0 flex-1">
        <BodyFigure
          containerRef={ref}
          svgRef={svgRef}
          hitPathRef={hitPathRef}
          handlers={handlers}
          viewBox={viewBox}
          markerScale={markerScale}
          interacting={interacting}
          side={body.side}
          sensations={body.preview}
          focusPoint={body.focusPoint}
          className="absolute inset-0"
        >
          {(project) =>
            body.others.map((sensation) => (
              <BodySensationChip
                key={sensation.id}
                sensation={sensation}
                project={project}
                onSelect={body.selectSensation}
              />
            ))
          }
        </BodyFigure>
        {active ? null : (
          <BodySideToggle
            value={body.side}
            onChange={body.setSide}
            className="absolute bottom-4 left-4 z-20"
          />
        )}
        <BodyFigureZoomControls
          canZoomIn={canZoomIn}
          canZoomOut={canZoomOut}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          className="absolute right-4 bottom-4 z-20"
        />
      </div>
      <div className="relative shrink-0 px-6 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {active ? (
          <BodySensationEditor
            value={body.value}
            tags={body.tags}
            editingValue={body.editingValue}
            onChange={body.setValue}
            onCommit={body.commitValue}
            onToggleTag={body.toggleTag}
            onEditValue={body.editValue}
            onContinue={body.showOverview}
          />
        ) : (
          <NewRecordBodyStepFooter
            hasSensations={sensations.length > 0}
            onContinue={onContinue}
          />
        )}
      </div>
    </div>
  );
}
