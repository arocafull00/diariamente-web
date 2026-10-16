"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { BodyFigure, BodySensation } from "@/db/schema";
import type { BodyRegionId, SensationValue } from "@/lib/body-sensations";
import { updateBodyFigure } from "@/server/actions/profile";

type SheetView =
  | { name: "figure" }
  | { name: "overview" }
  | { name: "region"; region: BodyRegionId };

type UseBodySensationsSheetOptions = {
  initialFigure: BodyFigure | null;
  sensations: BodySensation[];
  onSave: (sensation: BodySensation) => void;
  onRemove: (region: string) => void;
};

export function useBodySensationsSheet({
  initialFigure,
  sensations,
  onSave,
  onRemove,
}: UseBodySensationsSheetOptions) {
  const [open, setOpen] = useState(false);
  const [figure, setFigure] = useState(initialFigure);
  const [view, setView] = useState<SheetView>({ name: "overview" });
  const [value, setValue] = useState<SensationValue | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [editingValue, setEditingValue] = useState(true);
  const [savingFigure, startSavingFigure] = useTransition();
  const region = view.name === "region" ? view.region : null;
  const saved = sensations.find((sensation) => sensation.region === region);
  const others = sensations.filter((sensation) => sensation.region !== region);
  const preview = region && value ? [...others, { region, ...value, tags }] : sensations;

  function openSheet() {
    setView(figure ? { name: "overview" } : { name: "figure" });
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

  function saveFigure(next: BodyFigure) {
    startSavingFigure(async () => {
      const result = await updateBodyFigure({ figure: next });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setFigure(next);
      showOverview();
    });
  }

  function leaveFigurePicker() {
    if (!figure) {
      setOpen(false);
      return;
    }

    showOverview();
  }

  return {
    open,
    figure,
    view,
    region,
    saved,
    value,
    tags,
    editingValue,
    preview,
    savingFigure,
    openSheet,
    closeSheet: () => setOpen(false),
    showOverview,
    changeFigure: () => setView({ name: "figure" }),
    selectRegion,
    setValue,
    commitValue,
    editValue: () => setEditingValue(true),
    toggleTag,
    saveSensation,
    removeSensation,
    saveFigure,
    leaveFigurePicker,
  };
}
