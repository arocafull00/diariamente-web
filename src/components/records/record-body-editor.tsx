"use client";

import { useState } from "react";

import { NewRecordBodyStep } from "@/components/records/new-record-body-step";
import { NewRecordTopBar } from "@/components/records/new-record-top-bar";
import { RecordEditorOverlay } from "@/components/records/record-editor-overlay";
import type { BodySensation } from "@/db/schema";

type RecordBodyEditorProps = {
  sensations: BodySensation[];
  onApply: (sensations: BodySensation[]) => void;
  onClose: () => void;
};

export function RecordBodyEditor({ sensations, onApply, onClose }: RecordBodyEditorProps) {
  const [draft, setDraft] = useState(sensations);

  function saveSensation(sensation: BodySensation) {
    setDraft((current) =>
      current.some((item) => item.id === sensation.id)
        ? current.map((item) => (item.id === sensation.id ? sensation : item))
        : [...current, sensation],
    );
  }

  function removeSensation(id: string) {
    setDraft((current) => current.filter((item) => item.id !== id));
  }

  return (
    <RecordEditorOverlay palette={null}>
      <NewRecordTopBar
        phase={0}
        phaseCount={1}
        canGoBack={false}
        onBack={onClose}
        onClose={onClose}
      />
      <div className="relative flex-1 overflow-hidden">
        <NewRecordBodyStep
          sensations={draft}
          onSave={saveSensation}
          onRemove={removeSensation}
          onContinue={() => onApply(draft)}
        />
      </div>
    </RecordEditorOverlay>
  );
}
