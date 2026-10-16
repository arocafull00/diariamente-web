"use client";

import { ArrowLeft, PersonStanding, Trash2, X } from "lucide-react";

import { BodyFigure } from "@/components/records/body-figure";
import { BodyRegionList } from "@/components/records/body-region-list";
import { BodySensationChip } from "@/components/records/body-sensation-chip";
import { BodySensationEditor } from "@/components/records/body-sensation-editor";
import { BodySensationsHeader } from "@/components/records/body-sensations-header";
import { BodySensationsOverviewFooter } from "@/components/records/body-sensations-overview-footer";
import type { useBodySensationsSheet } from "@/components/records/use-body-sensations-sheet";
import type { BodyFigure as BodyFigureId, BodySensation } from "@/db/schema";
import { getBodyRegionPhrase } from "@/lib/body-sensations";

type BodySensationsBodyViewProps = {
  figure: BodyFigureId;
  sensations: BodySensation[];
  sheet: ReturnType<typeof useBodySensationsSheet>;
};

const OVERVIEW_TITLE = "¿Dónde notas una sensación física?";

export function BodySensationsBodyView({ figure, sensations, sheet }: BodySensationsBodyViewProps) {
  const { region } = sheet;

  return (
    <div className="flex h-full flex-col">
      {region ? (
        <BodySensationsHeader
          title={getBodyRegionPhrase(region)}
          leading={{ icon: ArrowLeft, label: "Volver al cuerpo", onClick: sheet.showOverview }}
          trailing={
            sheet.saved
              ? { icon: Trash2, label: "Eliminar sensación", onClick: sheet.removeSensation }
              : undefined
          }
        />
      ) : (
        <BodySensationsHeader
          title={OVERVIEW_TITLE}
          leading={{ icon: X, label: "Cerrar", onClick: sheet.closeSheet }}
          trailing={{ icon: PersonStanding, label: "Cambiar figura", onClick: sheet.changeFigure }}
        />
      )}
      <BodyFigure
        figure={figure}
        sensations={sheet.preview}
        focusRegion={region}
        onSelectRegion={region ? undefined : sheet.selectRegion}
        className="min-h-0 flex-1 overflow-hidden"
      >
        {(project) =>
          region
            ? null
            : sensations.map((sensation) => (
                <BodySensationChip
                  key={sensation.region}
                  sensation={sensation}
                  project={project}
                  onSelect={sheet.selectRegion}
                />
              ))
        }
      </BodyFigure>
      {region ? null : <BodyRegionList onSelect={sheet.selectRegion} />}
      <div className="relative shrink-0 px-6 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {region ? (
          <BodySensationEditor
            region={region}
            value={sheet.value}
            tags={sheet.tags}
            editingValue={sheet.editingValue}
            onChange={sheet.setValue}
            onCommit={sheet.commitValue}
            onToggleTag={sheet.toggleTag}
            onEditValue={sheet.editValue}
            onContinue={sheet.saveSensation}
          />
        ) : (
          <BodySensationsOverviewFooter
            hasSensations={sensations.length > 0}
            onDone={sheet.closeSheet}
          />
        )}
      </div>
    </div>
  );
}
