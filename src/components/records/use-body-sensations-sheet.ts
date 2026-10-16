"use client";

import { useState } from "react";

import type { BodySensation } from "@/db/schema";
import type { BodyRegionId, SensationValue } from "@/lib/body-sensations";

type SheetView =
  | { name: "overview" }
  | { name: "region"; region: BodyRegionId };

type UseBodySensationsSheetOptions = {
  sensations: BodySensation[];
  onSave: (sensation: BodySensation) => void;
  onRemove: (region: string) => void;
};

export function useBodySensationsSheet({
  sensations,
  onSave,
  onRemove,
}: UseBodySensationsSheetOptions) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<SheetView>({ name: "overview" });
  const [value, setValue] = useState<SensationValue | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [editingValue, setEditingValue] = useState(true);
  const region = view.name === "region" ? view.region : null;
  const saved = sensations.find((sensation) => sensation.region === region);
  const others = sensations.filter((sensation) => sensation.region !== region);
  const preview = region && value ? [...others, { region, ...value, tags }] : sensations;

  function openSheet() {
    setView({ name: "overview" });
    setOpen(true);
  }

  function showOverview() {
    setView({ name: "overview" });
  }

  function selectRegion(next: BodyRegionId) {
    const existing = sensations.find((sensation) => sensation.region === next);

    setValue(
      existing
        ? { pleasantness: existing.pleasantness, intensity: existing.intensity }
        : null,
    );
    setTags(existing?.tags ?? []);
    setEditingValue(!existing);
    setView({ name: "region", region: next });
  }

  function commitValue(next: SensationValue) {
    setValue(next);
    setEditingValue(false);
  }

  function toggleTag(tag: string) {
    setTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  }

  function saveSensation() {
    if (!region || !value) {
      return;
    }

    onSave({ region, ...value, tags });
    showOverview();
  }

  function removeSensation() {
    if (!region) {
      return;
    }

    onRemove(region);
    showOverview();
  }

  return {
    open,
    view,
    region,
    saved,
    value,
    tags,
    editingValue,
    preview,
    openSheet,
    closeSheet: () => setOpen(false),
    showOverview,
    selectRegion,
    setValue,
    commitValue,
    editValue: () => setEditingValue(true),
    toggleTag,
    saveSensation,
    removeSensation,
  };
}
