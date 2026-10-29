import type { MoodQuadrant } from "@/db/schema";
import {
  findEmotion,
  type EmotionGroup,
  type EmotionOption,
} from "@/lib/emotions";

type EmotionTreeBranch = {
  name: string;
  children: [string, string];
};

export type EmotionTreeRoot = {
  id: string;
  label: string;
  quadrant: MoodQuadrant;
  palette: MoodQuadrant;
  branches: EmotionTreeBranch[];
};

export const EMOTION_TREE: EmotionTreeRoot[] = [
  {
    id: "rabia",
    label: "Rabia",
    quadrant: "HIGH_UNPLEASANT",
    palette: "HIGH_UNPLEASANT",
    branches: [
      { name: "Enfadado", children: ["Furioso", "Molesto"] },
      { name: "Impotente", children: ["Bloqueado", "Abatido"] },
      { name: "Traicionado", children: ["Despreciado", "Indignado"] },
      { name: "Harto", children: ["Saturado", "Cansado"] },
      { name: "Irritado", children: ["Frustrado", "Tenso"] },
    ],
  },
  {
    id: "tristeza",
    label: "Tristeza",
    quadrant: "LOW_UNPLEASANT",
    palette: "LOW_UNPLEASANT",
    branches: [
      { name: "Solo", children: ["Abandonado", "Incomprendido"] },
      { name: "Deprimido", children: ["Apático", "Vacío"] },
      { name: "Herido", children: ["Decepcionado", "Rechazado"] },
      { name: "Culpable", children: ["Arrepentido", "Avergonzado"] },
      { name: "Vulnerable", children: ["Frágil", "Indefenso"] },
    ],
  },
  {
    id: "ansiedad",
    label: "Ansiedad",
    quadrant: "HIGH_UNPLEASANT",
    palette: "LOW_PLEASANT",
    branches: [
      { name: "Nervioso", children: ["Preocupado", "Agobiado"] },
      { name: "Inseguro", children: ["Insuficiente", "Indeciso"] },
      { name: "Estresado", children: ["Desbordado", "Presionado"] },
      { name: "Asustado", children: ["Intimidado", "Cohibido"] },
      { name: "Alerta", children: ["Tenso", "Desconfiado"] },
    ],
  },
  {
    id: "alegria",
    label: "Alegría",
    quadrant: "HIGH_PLEASANT",
    palette: "HIGH_PLEASANT",
    branches: [
      { name: "Ilusionado", children: ["Esperanzado", "Motivado"] },
      { name: "Tranquilo", children: ["Relajado", "A gusto"] },
      { name: "Orgulloso", children: ["Satisfecho", "Capaz"] },
      { name: "Divertido", children: ["Animado", "Entretenido"] },
      { name: "Empoderado", children: ["Seguro", "Valiente"] },
    ],
  },
];

export function getTreeEmotionQuadrant(name: string, root: EmotionTreeRoot) {
  return findEmotion(name)?.quadrant ?? root.quadrant;
}

export function getEmotionGroupPalette(group: string | null, quadrant: MoodQuadrant) {
  return EMOTION_TREE.find((root) => root.id === group)?.palette ?? quadrant;
}

export function findTreeBranch(root: EmotionTreeRoot, name: string | null) {
  if (!name) {
    return null;
  }

  return (
    root.branches.find((branch) => branch.name === name || branch.children.includes(name))
      ?.name ?? null
  );
}

export const EMOTION_TREE_GROUPS: EmotionGroup[] = EMOTION_TREE.map((root) => ({
  id: root.id,
  label: root.label,
  quadrant: root.quadrant,
  items: root.branches
    .flatMap((branch) => [branch.name, ...branch.children])
    .map((name) => ({ name, quadrant: getTreeEmotionQuadrant(name, root) })),
}));

const TREE_NAMES = new Set(
  EMOTION_TREE_GROUPS.flatMap((group) => group.items.map((item) => item.name)),
);

export const EMOTION_TREE_OPTIONS: EmotionOption[] = [...TREE_NAMES].flatMap(
  (name) => findEmotion(name) ?? [],
);

export function findEmotionTreeRoot(name: string) {
  return EMOTION_TREE_GROUPS.find((group) =>
    group.items.some((item) => item.name === name),
  )?.id;
}
