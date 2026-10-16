import type { BodySensation, MoodQuadrant } from "@/db/schema";

export const BODY_REGION_IDS = [
  "head",
  "neck",
  "shoulder_right",
  "shoulder_left",
  "chest",
  "stomach",
  "upper_arm_right",
  "upper_arm_left",
  "forearm_right",
  "forearm_left",
  "hand_right",
  "hand_left",
  "hips",
  "thigh_right",
  "thigh_left",
  "knee_right",
  "knee_left",
  "shin_right",
  "shin_left",
  "foot_right",
  "foot_left",
] as const;

export type BodyRegionId = (typeof BODY_REGION_IDS)[number];

type Gender = "m" | "f";

type BodyRegion = {
  label: string;
  gender: Gender;
  x: number;
  y: number;
};

export const BODY_REGIONS: Record<BodyRegionId, BodyRegion> = {
  head: { label: "cabeza", gender: "f", x: 100, y: 37 },
  neck: { label: "cuello", gender: "m", x: 100, y: 71 },
  shoulder_right: { label: "hombro derecho", gender: "m", x: 70, y: 86 },
  shoulder_left: { label: "hombro izquierdo", gender: "m", x: 130, y: 86 },
  chest: { label: "pecho", gender: "m", x: 100, y: 110 },
  stomach: { label: "estómago", gender: "m", x: 100, y: 162 },
  upper_arm_right: { label: "brazo derecho", gender: "m", x: 55, y: 126 },
  upper_arm_left: { label: "brazo izquierdo", gender: "m", x: 145, y: 126 },
  forearm_right: { label: "antebrazo derecho", gender: "m", x: 44, y: 184 },
  forearm_left: { label: "antebrazo izquierdo", gender: "m", x: 156, y: 184 },
  hand_right: { label: "mano derecha", gender: "f", x: 29, y: 232 },
  hand_left: { label: "mano izquierda", gender: "f", x: 171, y: 232 },
  hips: { label: "cadera", gender: "f", x: 100, y: 204 },
  thigh_right: { label: "muslo derecho", gender: "m", x: 84, y: 264 },
  thigh_left: { label: "muslo izquierdo", gender: "m", x: 116, y: 264 },
  knee_right: { label: "rodilla derecha", gender: "f", x: 84, y: 307 },
  knee_left: { label: "rodilla izquierda", gender: "f", x: 116, y: 307 },
  shin_right: { label: "pierna derecha", gender: "f", x: 85, y: 354 },
  shin_left: { label: "pierna izquierda", gender: "f", x: 115, y: 354 },
  foot_right: { label: "pie derecho", gender: "m", x: 84, y: 404 },
  foot_left: { label: "pie izquierdo", gender: "m", x: 116, y: 404 },
};

export function isBodyRegionId(value: string): value is BodyRegionId {
  return value in BODY_REGIONS;
}

export function findNearestBodyRegion(x: number, y: number): BodyRegionId {
  let nearest: BodyRegionId = BODY_REGION_IDS[0];
  let nearestDistance = Infinity;

  for (const id of BODY_REGION_IDS) {
    const region = BODY_REGIONS[id];
    const distance = Math.hypot(region.x - x, region.y - y);

    if (distance < nearestDistance) {
      nearest = id;
      nearestDistance = distance;
    }
  }

  return nearest;
}

export function getBodyRegionPhrase(region: string) {
  const label = isBodyRegionId(region) ? BODY_REGIONS[region].label : region;

  return `Mi ${label} se siente`;
}

export function getBodyRegionTitle(region: string) {
  const label = isBodyRegionId(region) ? BODY_REGIONS[region].label : region;

  return label.charAt(0).toUpperCase() + label.slice(1);
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

export function getSensationTagOptions(region: BodyRegionId, quadrant: MoodQuadrant) {
  const index = BODY_REGIONS[region].gender === "m" ? 0 : 1;

  return SENSATION_TAGS[quadrant].map((pair) => pair[index]);
}

export const SENSATION_FILLS: Record<MoodQuadrant, string> = {
  HIGH_UNPLEASANT: "fill-mood-hu-3",
  HIGH_PLEASANT: "fill-mood-hp-3",
  LOW_UNPLEASANT: "fill-mood-lu-3",
  LOW_PLEASANT: "fill-mood-lp-3",
};
