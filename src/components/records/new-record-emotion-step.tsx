"use client";

import { useState } from "react";

import { EmotionFieldPicker } from "@/components/records/emotion-field-picker";
import { EmotionSearchSheet } from "@/components/records/emotion-search-sheet";
import { EmotionSelectionBar } from "@/components/records/emotion-selection-bar";
import { EmotionTreePicker } from "@/components/records/emotion-tree-picker";
import type { GrammaticalGender, MoodQuadrant } from "@/db/schema";
import {
  EMOTION_TREE,
  EMOTION_TREE_OPTIONS,
  findEmotionTreeRoot,
} from "@/lib/emotion-tree";
import {
  EMOTION_QUADRANT_GROUPS,
  getEmotionLabel,
  getMoodStyles,
  type EmotionOption,
} from "@/lib/emotions";
import { useEmotionPickerModeStore } from "@/stores/emotion-picker-mode-store";

type NewRecordEmotionStepProps = {
  selectedQuadrant: MoodQuadrant;
  selectedGroup: string | null;
  emotion: string | null;
  definition: string;
  options: EmotionOption[];
  gender: GrammaticalGender;
  onSelect: (name: string, quadrant: MoodQuadrant, group: string) => void;
  onQuickSave: (name: string, quadrant: MoodQuadrant, group: string) => void;
  onContinue: () => void;
};

export function NewRecordEmotionStep({
  selectedQuadrant,
  selectedGroup,
  emotion,
  definition,
  options,
  gender,
  onSelect,
  onQuickSave,
  onContinue,
}: NewRecordEmotionStepProps) {
  const mode = useEmotionPickerModeStore((state) => state.mode);
  const [fieldKey, setFieldKey] = useState(0);
  const isTree = mode === "tree";
  const treeRoot = isTree
    ? EMOTION_TREE.find((root) => root.id === selectedGroup)
    : undefined;

  function handleSearchSelect(option: EmotionOption) {
    const quadrant = option.quadrant ?? selectedQuadrant;
    const group = isTree ? findEmotionTreeRoot(option.name) : quadrant;

    if (!group) {
      return;
    }

    onSelect(option.name, quadrant, group);
    setFieldKey((key) => key + 1);
  }

  return (
    <div className="relative h-full">
      {treeRoot ? (
        <EmotionTreePicker
          key={`${treeRoot.id}-${fieldKey}`}
          root={treeRoot}
          emotion={emotion}
          gender={gender}
          onSelect={onSelect}
          onQuickSave={onQuickSave}
          onContinue={onContinue}
        />
      ) : (
        <EmotionFieldPicker
          key={fieldKey}
          groups={EMOTION_QUADRANT_GROUPS}
          selectedGroup={selectedGroup}
          emotion={emotion}
          gender={gender}
          onSelect={onSelect}
          onQuickSave={onQuickSave}
          onContinue={onContinue}
        />
      )}

      <div className="absolute top-19 right-4 z-20">
        <EmotionSearchSheet
          options={isTree ? EMOTION_TREE_OPTIONS : options}
          gender={gender}
          onSelect={handleSearchSelect}
        />
      </div>

      <EmotionSelectionBar
        emotion={emotion ? getEmotionLabel(emotion, gender) : null}
        definition={definition}
        styles={getMoodStyles(treeRoot?.palette ?? selectedQuadrant)}
        onContinue={onContinue}
      />
    </div>
  );
}
