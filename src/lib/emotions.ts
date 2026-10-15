import type { MoodQuadrant, RecordEmotion } from "@/db/schema";

export type EmotionDefinition = {
  name: string;
  definition: string;
  quadrant: MoodQuadrant;
};

export type MoodTone = 1 | 2 | 3;

export type EmotionOption = {
  name: string;
  definition: string;
  quadrant: MoodQuadrant | null;
};

export const CUSTOM_EMOTION_DEFINITION = "emoción añadida por ti";

export const MOOD_QUADRANTS: {
  id: MoodQuadrant;
  energy: string;
  pleasantness: string;
}[] = [
  { id: "HIGH_UNPLEASANT", energy: "Alta energía", pleasantness: "Desagradable" },
  { id: "HIGH_PLEASANT", energy: "Alta energía", pleasantness: "Agradable" },
  { id: "LOW_UNPLEASANT", energy: "Baja energía", pleasantness: "Desagradable" },
  { id: "LOW_PLEASANT", energy: "Baja energía", pleasantness: "Agradable" },
];

export function isMoodQuadrant(value: string | undefined): value is MoodQuadrant {
  return MOOD_QUADRANTS.some((quadrant) => quadrant.id === value);
}

function defineQuadrant(
  quadrant: MoodQuadrant,
  entries: [string, string][],
): EmotionDefinition[] {
  return entries.map(([name, definition]) => ({ name, definition, quadrant }));
}

export const EMOTIONS: EmotionDefinition[] = [
  ...defineQuadrant("HIGH_UNPLEASANT", [
    ["Furioso", "lleno de una ira intensa y difícil de contener"],
    ["Aterrorizado", "con un miedo extremo ante un peligro"],
    ["Enfurecido", "enojarte por algo; lleno de ira extrema"],
    ["En pánico", "invadido por un miedo repentino que te bloquea"],
    ["Desbordado", "sentir que lo que ocurre supera tus recursos"],
    ["Iracundo", "sentir que la ira está a punto de salirse de control"],
    ["Estresado", "bajo presión por exigencias que sientes excesivas"],
    ["Ansioso", "preocupado de forma persistente por lo que pueda pasar"],
    ["Asustado", "percibir una amenaza o peligro, ya sea físico o emocional"],
    ["Enfadado", "molesto por algo que consideras injusto o dañino"],
    ["Frustrado", "bloqueado al no conseguir algo que quieres"],
    ["Celoso", "temer perder algo o a alguien que valoras"],
    ["Nervioso", "inquieto y en tensión ante algo que va a pasar"],
    ["Irritado", "molesto con facilidad por cosas pequeñas"],
    ["Preocupado", "dar vueltas a un problema real o posible"],
    ["Tenso", "con el cuerpo o la mente en estado de alerta"],
    ["Asqueado", "sentir un rechazo intenso hacia algo o alguien"],
    ["Avergonzado", "incómodo por cómo te ven los demás"],
    ["Inquieto", "sin poder estar tranquilo ni concentrarte"],
    ["Incómodo", "sensación vaga de que algo va mal"],
  ]),
  ...defineQuadrant("HIGH_PLEASANT", [
    ["Eufórico", "con una alegría desbordante e intensa"],
    ["Extasiado", "lleno de un placer o entusiasmo enorme"],
    ["Emocionado", "con mucha ilusión por algo que ocurre o va a ocurrir"],
    ["Exultante", "celebrar algo con una alegría muy viva"],
    ["Inspirado", "con ganas de crear o hacer algo nuevo"],
    ["Empoderado", "sentirte más fuerte o seguro gracias a algo que ha sucedido"],
    ["Entusiasmado", "con energía e interés por lo que haces"],
    ["Orgulloso", "satisfecho por algo que has logrado"],
    ["Motivado", "con impulso para avanzar hacia un objetivo"],
    ["Optimista", "esperanzado y confiado en el futuro"],
    ["Alegre", "contento y de buen humor"],
    ["Divertido", "pasarlo bien y tener ganas de reír"],
    ["Productivo", "sentir que avanzas y aprovechas el tiempo"],
    ["Esperanzado", "confiar en que algo bueno puede pasar"],
    ["Juguetón", "con ganas de bromear y disfrutar"],
    ["Sorprendido", "impactado para bien por algo inesperado"],
    ["Animado", "con buena energía y ánimo"],
    ["Curioso", "con interés por descubrir o aprender algo"],
    ["Agradable", "a gusto con lo que está pasando"],
    ["Complacido", "satisfecho con cómo han salido las cosas"],
  ]),
  ...defineQuadrant("LOW_UNPLEASANT", [
    ["Desesperado", "no ver salida a lo que te está pasando"],
    ["Deprimido", "hundido, sin energía ni ilusión durante un tiempo"],
    ["Miserable", "sentirte absolutamente horrible"],
    ["Desolado", "con una tristeza profunda tras una pérdida"],
    ["Vacío", "no sentir nada, como desconectado de todo"],
    ["Solo", "echar en falta compañía o conexión con otros"],
    ["Culpable", "creer que has hecho algo mal y cargar con ello"],
    ["Humillado", "herido en tu dignidad delante de otros"],
    ["Agotado", "sin fuerzas físicas ni mentales"],
    ["Triste", "con el ánimo bajo por algo que duele"],
    ["Desanimado", "con menos ganas tras un revés"],
    ["Decepcionado", "algo no ha salido como esperabas"],
    ["Excluido", "sentir que los demás te dejan de lado"],
    ["Vulnerable", "expuesto y fácil de herir"],
    ["Abatido", "bajo de ánimo y sin energía"],
    ["Desmotivado", "sin ganas de hacer lo que tenías pensado"],
    ["Cansado", "sentir que necesitas descansar"],
    ["Aburrido", "sin interés por lo que ocurre a tu alrededor"],
    ["Apático", "indiferente, sin ganas de nada"],
    ["Meh", "sentirte sin inspiración o aburrido"],
  ]),
  ...defineQuadrant("LOW_PLEASANT", [
    ["Sereno", "tranquilo y pacífico; sin problemas"],
    ["Pleno", "sentir que lo que vives ahora tiene sentido"],
    ["Agradecido", "valorar algo bueno que tienes o has recibido"],
    ["En paz", "sin conflicto interno"],
    ["Satisfecho", "contento con lo que tienes o has hecho"],
    ["Querido", "sentir el cariño de otras personas"],
    ["Seguro", "a salvo y protegido"],
    ["Equilibrado", "estable y centrado"],
    ["Relajado", "sentirte relajado y despreocupado"],
    ["Tranquilo", "sin prisas ni preocupaciones"],
    ["Comprendido", "sentir que otros entienden cómo estás"],
    ["Conectado", "unido a otras personas o a lo que haces"],
    ["Cómodo", "a gusto en el lugar o la situación"],
    ["Reflexivo", "pensar con calma sobre las cosas"],
    ["Descansado", "con la energía recuperada tras descansar"],
    ["Apacible", "con una calma suave y estable"],
    ["Acompañado", "sentir que no estás solo"],
    ["Compasivo", "sentir ternura y comprensión por alguien"],
    ["A gusto", "bien con lo que está pasando"],
    ["Bien", "estar bien, sin más"],
  ]),
];

const LEGACY_EMOTION_QUADRANTS: Record<string, MoodQuadrant> = {
  Alegría: "HIGH_PLEASANT",
  Tristeza: "LOW_UNPLEASANT",
  Miedo: "HIGH_UNPLEASANT",
  Rabia: "HIGH_UNPLEASANT",
  Asco: "HIGH_UNPLEASANT",
  Ansiedad: "HIGH_UNPLEASANT",
};

const EMOTIONS_BY_NAME = new Map(
  EMOTIONS.map((emotion) => [emotion.name.toLowerCase(), emotion]),
);

export function findEmotion(name: string) {
  return EMOTIONS_BY_NAME.get(name.toLowerCase());
}

export function getEmotionsByQuadrant(quadrant: MoodQuadrant) {
  return EMOTIONS.filter((emotion) => emotion.quadrant === quadrant);
}

export function getEmotionTone(index: number, total: number): MoodTone {
  const ratio = index / Math.max(total, 1);

  if (ratio < 1 / 3) {
    return 3;
  }

  if (ratio < 2 / 3) {
    return 2;
  }

  return 1;
}

export function getEmotionQuadrant(name: string): MoodQuadrant | null {
  return findEmotion(name)?.quadrant ?? LEGACY_EMOTION_QUADRANTS[name] ?? null;
}

export function getDominantEmotion(emotions: RecordEmotion[]) {
  return [...emotions].sort((a, b) => b.intensity - a.intensity)[0] ?? null;
}

export function getRecordQuadrant(record: {
  quadrant: MoodQuadrant | null;
  emotions: RecordEmotion[];
}) {
  if (record.quadrant) {
    return record.quadrant;
  }

  const dominant = getDominantEmotion(record.emotions);

  return dominant ? getEmotionQuadrant(dominant.emotion) : null;
}

export function getQuadrantLabel(quadrant: MoodQuadrant) {
  const meta = MOOD_QUADRANTS.find((item) => item.id === quadrant);

  return meta ? `${meta.energy} · ${meta.pleasantness}` : "";
}

export type MoodStyles = {
  tones: Record<MoodTone, string>;
  soft: string;
  strong: string;
  stroke: string;
  ring: string;
};

export const MOOD_STYLES: Record<MoodQuadrant, MoodStyles> = {
  HIGH_UNPLEASANT: {
    tones: { 1: "bg-mood-hu-1", 2: "bg-mood-hu-2", 3: "bg-mood-hu-3" },
    soft: "bg-mood-hu-soft",
    strong: "text-mood-hu-strong",
    stroke: "stroke-mood-hu-2",
    ring: "ring-mood-hu-strong",
  },
  HIGH_PLEASANT: {
    tones: { 1: "bg-mood-hp-1", 2: "bg-mood-hp-2", 3: "bg-mood-hp-3" },
    soft: "bg-mood-hp-soft",
    strong: "text-mood-hp-strong",
    stroke: "stroke-mood-hp-2",
    ring: "ring-mood-hp-strong",
  },
  LOW_UNPLEASANT: {
    tones: { 1: "bg-mood-lu-1", 2: "bg-mood-lu-2", 3: "bg-mood-lu-3" },
    soft: "bg-mood-lu-soft",
    strong: "text-mood-lu-strong",
    stroke: "stroke-mood-lu-2",
    ring: "ring-mood-lu-strong",
  },
  LOW_PLEASANT: {
    tones: { 1: "bg-mood-lp-1", 2: "bg-mood-lp-2", 3: "bg-mood-lp-3" },
    soft: "bg-mood-lp-soft",
    strong: "text-mood-lp-strong",
    stroke: "stroke-mood-lp-2",
    ring: "ring-mood-lp-strong",
  },
};

const NEUTRAL_MOOD_STYLES: MoodStyles = {
  tones: { 1: "bg-accent", 2: "bg-accent", 3: "bg-accent" },
  soft: "bg-secondary",
  strong: "text-primary",
  stroke: "stroke-primary",
  ring: "ring-primary",
};

export function getMoodStyles(quadrant: MoodQuadrant | null) {
  return quadrant ? MOOD_STYLES[quadrant] : NEUTRAL_MOOD_STYLES;
}
