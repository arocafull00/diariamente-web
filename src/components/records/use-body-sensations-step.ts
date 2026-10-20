"use client";

import { useState } from "react";

import { useBodyFigureCamera } from "@/components/records/use-body-figure-camera";
import type { BodySensation } from "@/db/schema";
import type { BodyRegionId, SensationValue } from "@/lib/body-sensations";

type UseBodySensationsStepOptions = {
  sensations: BodySensation[];
  onSave: (sensation: BodySensation) => void;
  onRemove: (region: string) => void;
};

export function useBodySensationsStep({
  sensations,
  onSave,
  onRemove,
}: UseBodySensationsStepOptions) {
  const camera = useBodyFigureCamera({ onSelectRegion: (next) => selectRegion(next) });
  const [region, setRegion] = useState<BodyRegionId | null>(null);
  const [draft, setDraft] = useState<SensationValue | null>(null);
  const [editingValue, setEditingValue] = useState(true);
  const saved = sensations.find((sensation) => sensation.region === region);
  const tags = saved?.tags ?? [];
  const value =
    draft ?? (saved ? { pleasantness: saved.pleasantness, intensity: saved.intensity } : null);
  const others = sensations.filter((sensation) => sensation.region !== region);
  const preview = region && draft ? [...others, { region, ...draft, tags }] : sensations;

  function selectRegion(next: BodyRegionId) {
    setRegion(next);
    setDraft(null);
    setEditingValue(!sensations.some((sensation) => sensation.region === next));
    camera.focusOn(next);
  }

  function showOverview() {
    setRegion(null);
    setDraft(null);
    camera.reset();
  }

  function commitValue(next: SensationValue) {
    if (!region) {
      return;
    }

    onSave({ region, ...next, tags });
    setDraft(null);
    setEditingValue(false);
  }

  function toggleTag(tag: string) {
    if (!saved) {
      return;
    }

    onSave({
      ...saved,
      tags: tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag],
    });
  }

  function removeSensation() {
    if (!region) {
      return;
    }

    onRemove(region);
    showOverview();
  }

  return {
    camera,
    region,
    saved,
    value,
    tags,
    editingValue,
    preview,
    others,
    selectRegion,
    showOverview,
    setValue: setDraft,
    commitValue,
    editValue: () => setEditingValue(true),
    toggleTag,
    removeSensation,
  };
}
