"use client";

import { BodySensationsField } from "@/components/records/body-sensations-field";
import { ContextTagGroup } from "@/components/records/context-tag-group";
import { NewRecordNextButton } from "@/components/records/new-record-next-button";
import { NewRecordStepTitle } from "@/components/records/new-record-step-title";
import type {
  BodySensation,
  MoodQuadrant,
  RecordContext,
} from "@/db/schema";
import { CONTEXT_GROUPS, type ContextGroup } from "@/lib/context-tags";
import { getMoodStyles } from "@/lib/emotions";

type NewRecordContextStepProps = {
  emotion: string;
  quadrant: MoodQuadrant | null;
  context: RecordContext;
  bodySensations: BodySensation[];
  onToggle: (group: ContextGroup, tag: string) => void;
  onSaveSensation: (sensation: BodySensation) => void;
  onRemoveSensation: (region: string) => void;
  onContinue: () => void;
};

export function NewRecordContextStep({
  emotion,
  quadrant,
  context,
  bodySensations,
  onToggle,
  onSaveSensation,
  onRemoveSensation,
  onContinue,
}: NewRecordContextStepProps) {
  const styles = getMoodStyles(quadrant);

  return (
    <div className="relative mx-auto flex h-full w-full max-w-lg flex-col">
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <NewRecordStepTitle
          before="¿Qué estabas haciendo cuando te sentiste"
          emphasis={emotion}
          after="?"
          emphasisClassName={styles.strong}
        />
        <div className="mt-8 space-y-7">
          {CONTEXT_GROUPS.map((group) => (
            <ContextTagGroup
              key={group.id}
              label={group.label}
              options={group.options}
              selected={context[group.id]}
              styles={styles}
              onToggle={(tag) => onToggle(group.id, tag)}
            />
          ))}
          <BodySensationsField
            sensations={bodySensations}
            onSave={onSaveSensation}
            onRemove={onRemoveSensation}
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end bg-linear-to-t from-background via-background/90 to-transparent px-6 pt-10 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <NewRecordNextButton onClick={onContinue} className="pointer-events-auto" />
      </div>
    </div>
  );
}
