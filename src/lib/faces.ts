import type { MoodQuadrant } from "@/db/schema";
import type { EmotionGroup } from "@/lib/emotions";

export type FaceId =
  | "01_gradiente"
  | "02_azul_rosa"
  | "03_verde_morado"
  | "04_naranja_amarillo"
  | "05_rosa_verde"
  | "alegria"
  | "ansiedad"
  | "rabia"
  | "tristeza";

export const DECORATIVE_FACE_IDS: readonly FaceId[] = [
  "01_gradiente",
  "02_azul_rosa",
  "03_verde_morado",
  "04_naranja_amarillo",
  "05_rosa_verde",
];

const QUADRANT_FACES: Record<MoodQuadrant, FaceId> = {
  HIGH_UNPLEASANT: "ansiedad",
  HIGH_PLEASANT: "alegria",
  LOW_UNPLEASANT: "tristeza",
  LOW_PLEASANT: "05_rosa_verde",
};

const EMOTION_GROUP_FACES: Partial<Record<string, FaceId>> = {
  rabia: "rabia",
  tristeza: "tristeza",
  ansiedad: "ansiedad",
  alegria: "alegria",
};

export function getFaceUrl(faceId: FaceId): string {
  return `/caras/${faceId}.svg`;
}

export function getQuadrantFace(quadrant: MoodQuadrant | null): FaceId {
  return quadrant ? QUADRANT_FACES[quadrant] : "01_gradiente";
}

export function getEmotionGroupFace(group: EmotionGroup): FaceId {
  return EMOTION_GROUP_FACES[group.id] ?? getQuadrantFace(group.quadrant);
}
