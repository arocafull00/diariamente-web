import type {
  BodySensation,
  BodySide,
  MoodQuadrant,
  StoredBodySensation,
} from "@/db/schema";

import { BODY_FIGURE_VIEWBOX } from "@/lib/body-figures";

export type FigurePoint = { x: number; y: number };

type LegacyBodyRegion = FigurePoint & { label: string };

const LEGACY_BODY_REGIONS: Record<string, LegacyBodyRegion> = {
  head: { label: "cabeza", x: 100, y: 37 },
  neck: { label: "cuello", x: 100, y: 71 },
  shoulder_right: { label: "hombro derecho", x: 70, y: 86 },
  shoulder_left: { label: "hombro izquierdo", x: 130, y: 86 },
  chest: { label: "pecho", x: 100, y: 110 },
  stomach: { label: "estómago", x: 100, y: 162 },
  upper_arm_right: { label: "brazo derecho", x: 55, y: 126 },
  upper_arm_left: { label: "brazo izquierdo", x: 145, y: 126 },
  forearm_right: { label: "antebrazo derecho", x: 44, y: 184 },
  forearm_left: { label: "antebrazo izquierdo", x: 156, y: 184 },
  hand_right: { label: "mano derecha", x: 29, y: 232 },
  hand_left: { label: "mano izquierda", x: 171, y: 232 },
  hips: { label: "cadera", x: 100, y: 204 },
  thigh_right: { label: "muslo derecho", x: 84, y: 264 },
  thigh_left: { label: "muslo izquierdo", x: 116, y: 264 },
  knee_right: { label: "rodilla derecha", x: 84, y: 307 },
  knee_left: { label: "rodilla izquierda", x: 116, y: 307 },
  shin_right: { label: "pierna derecha", x: 85, y: 354 },
  shin_left: { label: "pierna izquierda", x: 115, y: 354 },
  foot_right: { label: "pie derecho", x: 84, y: 404 },
  foot_left: { label: "pie izquierdo", x: 116, y: 404 },
};

export const MAX_BODY_SENSATIONS = 30;

export const BODY_POINT_PHRASE = "Esta zona se siente";

export const BODY_SIDES: BodySide[] = ["front", "back"];

export const BODY_SIDE_LABELS: Record<BodySide, string> = {
  front: "Delante",
  back: "Detrás",
};

export function getSensationSide(sensation: StoredBodySensation): BodySide {
  return "side" in sensation ? sensation.side : "front";
}

function clampUnit(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

export function toNormalizedPoint(point: FigurePoint): FigurePoint {
  return {
    x: clampUnit(point.x / BODY_FIGURE_VIEWBOX.width),
    y: clampUnit(point.y / BODY_FIGURE_VIEWBOX.height),
  };
}

export function toFigurePoint(point: FigurePoint): FigurePoint {
  return {
    x: point.x * BODY_FIGURE_VIEWBOX.width,
    y: point.y * BODY_FIGURE_VIEWBOX.height,
  };
}

export function getSensationFigurePoint(sensation: StoredBodySensation): FigurePoint | null {
  if ("region" in sensation) {
    return LEGACY_BODY_REGIONS[sensation.region] ?? null;
  }

  return toFigurePoint(sensation);
}

export function getSensationTitle(sensation: StoredBodySensation, index: number) {
  const fallback = `Zona ${index + 1}`;

  if (!("region" in sensation)) {
    return fallback;
  }

  const label = LEGACY_BODY_REGIONS[sensation.region]?.label;

  return label ? label.charAt(0).toUpperCase() + label.slice(1) : fallback;
}

export type SensationValue = Pick<BodySensation, "pleasantness" | "intensity">;

export const SENSATION_MIDPOINT = 50;

export function getSensationQuadrant(
  sensation: SensationValue,
): MoodQuadrant {
  const high = sensation.intensity >= SENSATION_MIDPOINT;
  const pleasant = sensation.pleasantness >= SENSATION_MIDPOINT;

  if (high) {
    return pleasant ? "HIGH_PLEASANT" : "HIGH_UNPLEASANT";
  }

  return pleasant ? "LOW_PLEASANT" : "LOW_UNPLEASANT";
}

export function getSensationPleasantnessLabel(sensation: SensationValue) {
  return sensation.pleasantness >= SENSATION_MIDPOINT ? "Agradable" : "Desagradable";
}

export function getSensationLabel(sensation: SensationValue) {
  const intensity =
    sensation.intensity >= SENSATION_MIDPOINT ? "alta intensidad" : "baja intensidad";

  return `${getSensationPleasantnessLabel(sensation)} & ${intensity}`;
}

export function formatSensationTags(tags: string[]) {
  if (tags.length <= 1) {
    return tags.join("");
  }

  return `${tags.slice(0, -1).join(", ")} & ${tags[tags.length - 1]}`;
}

export function getSensationSummary(sensation: BodySensation) {
  return sensation.tags.length > 0
    ? formatSensationTags(sensation.tags)
    : getSensationLabel(sensation);
}

const SENSATION_TAGS: Record<MoodQuadrant, [string, string][]> = {
  HIGH_UNPLEASANT: [
    ["Tenso", "Tensa"],
    ["Oprimido", "Oprimida"],
    ["Dolorido", "Dolorida"],
    ["Rígido", "Rígida"],
    ["Agarrotado", "Agarrotada"],
    ["Acelerado", "Acelerada"],
    ["Tembloroso", "Temblorosa"],
    ["Ardiente", "Ardiente"],
  ],
  HIGH_PLEASANT: [
    ["Activo", "Activa"],
    ["Vibrante", "Vibrante"],
    ["Energizado", "Energizada"],
    ["Cálido", "Cálida"],
    ["Despierto", "Despierta"],
    ["Ligero", "Ligera"],
    ["Fuerte", "Fuerte"],
    ["Expansivo", "Expansiva"],
  ],
  LOW_UNPLEASANT: [
    ["Pesado", "Pesada"],
    ["Cansado", "Cansada"],
    ["Entumecido", "Entumecida"],
    ["Frío", "Fría"],
    ["Débil", "Débil"],
    ["Hundido", "Hundida"],
    ["Adormecido", "Adormecida"],
    ["Bloqueado", "Bloqueada"],
  ],
  LOW_PLEASANT: [
    ["Relajado", "Relajada"],
    ["Cómodo", "Cómoda"],
    ["Ligero", "Ligera"],
    ["Suelto", "Suelta"],
    ["Cálido", "Cálida"],
    ["Descansado", "Descansada"],
    ["Suave", "Suave"],
    ["Tranquilo", "Tranquila"],
  ],
};

export function getSensationTagOptions(quadrant: MoodQuadrant) {
  return SENSATION_TAGS[quadrant].map((pair) => pair[1]);
}

export const SENSATION_FILLS: Record<MoodQuadrant, string> = {
  HIGH_UNPLEASANT: "fill-mood-hu-3",
  HIGH_PLEASANT: "fill-mood-hp-3",
  LOW_UNPLEASANT: "fill-mood-lu-3",
  LOW_PLEASANT: "fill-mood-lp-3",
};

export function getSensationGlowRadius(sensation: SensationValue) {
  return 14 + (sensation.intensity / 100) * 14;
}

export function getSensationKey(sensation: StoredBodySensation, index: number) {
  return "id" in sensation ? sensation.id : `${sensation.region}-${index}`;
}

export function getEditableSensations(sensations: StoredBodySensation[]): BodySensation[] {
  return sensations.flatMap((sensation) =>
    "region" in sensation ? [] : [{ ...sensation, side: getSensationSide(sensation) }],
  );
}

export function getLegacySensations(sensations: StoredBodySensation[]) {
  return sensations.filter((sensation) => "region" in sensation);
}
