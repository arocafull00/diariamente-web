"use client";

import { useState } from "react";

import { useBodyFigureCamera } from "@/components/records/use-body-figure-camera";
import type { BodySensation } from "@/db/schema";
import {
  MAX_BODY_SENSATIONS,
  toFigurePoint,
  toNormalizedPoint,
  type SensationValue,
} from "@/lib/body-sensations";

type UseBodySensationsStepOptions = {
  sensations: BodySensation[];
  onSave: (sensation: BodySensation) => void;
  onRemove: (id: string) => void;
};

type ActivePoint = Pick<BodySensation, "id" | "x" | "y">;

export function useBodySensationsStep({
  sensations,
  onSave,
  onRemove,
}: UseBodySensationsStepOptions) {
  const [active, setActive] = useState<ActivePoint | null>(null);
  const [draft, setDraft] = useState<SensationValue | null>(null);
  const [editingValue, setEditingValue] = useState(true);
  const focusPoint = active ? toFigurePoint(active) : null;
  const camera = useBodyFigureCamera({
    onTap: (point) => addPoint(point),
    dragPoint: focusPoint,
    onDrag: (point) => movePoint(point),
  });
  const saved = sensations.find((sensation) => sensation.id === active?.id);
  const tags = saved?.tags ?? [];
  const value =
    draft ?? (saved ? { pleasantness: saved.pleasantness, intensity: saved.intensity } : null);
  const others = sensations.filter((sensation) => sensation.id !== active?.id);
  const preview = active && draft ? [...others, { ...active, ...draft, tags }] : sensations;

  function addPoint(point: { x: number; y: number }) {
    if (sensations.length >= MAX_BODY_SENSATIONS) {
      return;
    }

    setActive({ id: crypto.randomUUID(), ...toNormalizedPoint(point) });
    setDraft(null);
    setEditingValue(true);
    camera.focusOn(point);
  }

  function movePoint(point: { x: number; y: number }) {
    if (!active) {
      return;
    }

    const next = { ...active, ...toNormalizedPoint(point) };

    setActive(next);

    if (saved) {
      onSave({ ...saved, x: next.x, y: next.y });
    }
  }

  function selectSensation(id: string) {
    const sensation = sensations.find((item) => item.id === id);

    if (!sensation) {
      return;
    }

    setActive({ id: sensation.id, x: sensation.x, y: sensation.y });
    setDraft(null);
    setEditingValue(false);
    camera.focusOn(toFigurePoint(sensation));
  }

  function showOverview() {
    setActive(null);
    setDraft(null);
    camera.reset();
  }

  function commitValue(next: SensationValue) {
    if (!active) {
      return;
    }

    onSave({ ...active, ...next, tags });
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
    if (!active) {
      return;
    }

    onRemove(active.id);
    showOverview();
  }

  return {
    camera,
    active,
    focusPoint,
    saved,
    value,
    tags,
    editingValue,
    preview,
    others,
    selectSensation,
    showOverview,
    setValue: setDraft,
    commitValue,
    editValue: () => setEditingValue(true),
    toggleTag,
    removeSensation,
  };
}
