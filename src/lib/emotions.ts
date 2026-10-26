import type {
  GrammaticalGender,
  MoodQuadrant,
  RecordEmotion,
} from "@/db/schema";

export type EmotionDefinition = {
  name: string;
  feminineName: string;
  definition: string;
  feminineDefinition: string;
  quadrant: MoodQuadrant;
};

export type MoodTone = 1 | 2 | 3;

export type EmotionOption = {
  name: string;
  feminineName: string;
  definition: string;
  feminineDefinition: string;
  quadrant: MoodQuadrant | null;
};

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

type EmotionEntry = [
  name: string,
  definition: string,
  feminineName?: string,
  feminineDefinition?: string,
];

function defineQuadrant(
  quadrant: MoodQuadrant,
  entries: EmotionEntry[],
): EmotionDefinition[] {
  return entries.map(([name, definition, feminineName, feminineDefinition]) => ({
    name,
    feminineName: feminineName ?? name,
    definition,
    feminineDefinition: feminineDefinition ?? definition,
    quadrant,
  }));
}

export const EMOTIONS: EmotionDefinition[] = [
  ...defineQuadrant("HIGH_UNPLEASANT", [
    [
      "Furioso",
      "lleno de una ira intensa y difícil de contener",
      "Furiosa",
      "llena de una ira intensa y difícil de contener",
    ],
    ["Aterrorizado", "con un miedo extremo ante un peligro", "Aterrorizada"],
    [
      "Enfurecido",
      "enojarte por algo; lleno de ira extrema",
      "Enfurecida",
      "enojarte por algo; llena de ira extrema",
    ],
    [
      "En pánico",
      "invadido por un miedo repentino que te bloquea",
      "En pánico",
      "invadida por un miedo repentino que te bloquea",
    ],
    [
      "Desbordado",
      "sentir que lo que ocurre supera tus recursos",
      "Desbordada",
    ],
    [
      "Iracundo",
      "sentir que la ira está a punto de salirse de control",
      "Iracunda",
    ],
    [
      "Estresado",
      "bajo presión por exigencias que sientes excesivas",
      "Estresada",
    ],
    [
      "Ansioso",
      "preocupado de forma persistente por lo que pueda pasar",
      "Ansiosa",
      "preocupada de forma persistente por lo que pueda pasar",
    ],
    [
      "Asustado",
      "percibir una amenaza o peligro, ya sea físico o emocional",
      "Asustada",
    ],
    [
      "Enfadado",
      "molesto por algo que consideras injusto o dañino",
      "Enfadada",
      "molesta por algo que consideras injusto o dañino",
    ],
    [
      "Frustrado",
      "bloqueado al no conseguir algo que quieres",
      "Frustrada",
      "bloqueada al no conseguir algo que quieres",
    ],
    ["Celoso", "temer perder algo o a alguien que valoras", "Celosa"],
    [
      "Nervioso",
      "inquieto y en tensión ante algo que va a pasar",
      "Nerviosa",
      "inquieta y en tensión ante algo que va a pasar",
    ],
    [
      "Irritado",
      "molesto con facilidad por cosas pequeñas",
      "Irritada",
      "molesta con facilidad por cosas pequeñas",
    ],
    ["Preocupado", "dar vueltas a un problema real o posible", "Preocupada"],
    ["Tenso", "con el cuerpo o la mente en estado de alerta", "Tensa"],
    ["Asqueado", "sentir un rechazo intenso hacia algo o alguien", "Asqueada"],
    [
      "Avergonzado",
      "incómodo por cómo te ven los demás",
      "Avergonzada",
      "incómoda por cómo te ven los demás",
    ],
    [
      "Inquieto",
      "sin poder estar tranquilo ni concentrarte",
      "Inquieta",
      "sin poder estar tranquila ni concentrarte",
    ],
    ["Incómodo", "sensación vaga de que algo va mal", "Incómoda"],
  ]),
  ...defineQuadrant("HIGH_PLEASANT", [
    ["Eufórico", "con una alegría desbordante e intensa", "Eufórica"],
    [
      "Extasiado",
      "lleno de un placer o entusiasmo enorme",
      "Extasiada",
      "llena de un placer o entusiasmo enorme",
    ],
    [
      "Ilusionado",
      "con mucha ilusión por algo que ocurre o va a ocurrir",
      "Ilusionada",
    ],
    ["Exultante", "celebrar algo con una alegría muy viva"],
    ["Inspirado", "con ganas de crear o hacer algo nuevo", "Inspirada"],
    [
      "Empoderado",
      "sentirte más fuerte o seguro gracias a algo que ha sucedido",
      "Empoderada",
      "sentirte más fuerte o segura gracias a algo que ha sucedido",
    ],
    ["Entusiasmado", "con energía e interés por lo que haces", "Entusiasmada"],
    [
      "Orgulloso",
      "satisfecho por algo que has logrado",
      "Orgullosa",
      "satisfecha por algo que has logrado",
    ],
    ["Motivado", "con impulso para avanzar hacia un objetivo", "Motivada"],
    [
      "Optimista",
      "esperanzado y confiado en el futuro",
      "Optimista",
      "esperanzada y confiada en el futuro",
    ],
    [
      "Alegre",
      "contento y de buen humor",
      "Alegre",
      "contenta y de buen humor",
    ],
    ["Divertido", "pasarlo bien y tener ganas de reír", "Divertida"],
    ["Productivo", "sentir que avanzas y aprovechas el tiempo", "Productiva"],
    ["Esperanzado", "confiar en que algo bueno puede pasar", "Esperanzada"],
    ["Juguetón", "con ganas de bromear y disfrutar", "Juguetona"],
    [
      "Sorprendido",
      "impactado para bien por algo inesperado",
      "Sorprendida",
      "impactada para bien por algo inesperado",
    ],
    ["Animado", "con buena energía y ánimo", "Animada"],
    ["Curioso", "con interés por descubrir o aprender algo", "Curiosa"],
    ["Agradable", "a gusto con lo que está pasando"],
    [
      "Complacido",
      "satisfecho con cómo han salido las cosas",
      "Complacida",
      "satisfecha con cómo han salido las cosas",
    ],
  ]),
  ...defineQuadrant("LOW_UNPLEASANT", [
    ["Desesperado", "no ver salida a lo que te está pasando", "Desesperada"],
    [
      "Deprimido",
      "hundido, sin energía ni ilusión durante un tiempo",
      "Deprimida",
      "hundida, sin energía ni ilusión durante un tiempo",
    ],
    ["Miserable", "sentirte absolutamente horrible"],
    ["Desolado", "con una tristeza profunda tras una pérdida", "Desolada"],
    [
      "Vacío",
      "no sentir nada, como desconectado de todo",
      "Vacía",
      "no sentir nada, como desconectada de todo",
    ],
    ["Solo", "echar en falta compañía o conexión con otros", "Sola"],
    ["Culpable", "creer que has hecho algo mal y cargar con ello"],
    [
      "Humillado",
      "herido en tu dignidad delante de otros",
      "Humillada",
      "herida en tu dignidad delante de otros",
    ],
    ["Agotado", "sin fuerzas físicas ni mentales", "Agotada"],
    ["Triste", "con el ánimo bajo por algo que duele"],
    ["Desanimado", "con menos ganas tras un revés", "Desanimada"],
    ["Decepcionado", "algo no ha salido como esperabas", "Decepcionada"],
    ["Excluido", "sentir que los demás te dejan de lado", "Excluida"],
    [
      "Vulnerable",
      "expuesto y fácil de herir",
      "Vulnerable",
      "expuesta y fácil de herir",
    ],
    ["Abatido", "bajo de ánimo y sin energía", "Abatida"],
    ["Desmotivado", "sin ganas de hacer lo que tenías pensado", "Desmotivada"],
    ["Cansado", "sentir que necesitas descansar", "Cansada"],
    ["Aburrido", "sin interés por lo que ocurre a tu alrededor", "Aburrida"],
    ["Apático", "indiferente, sin ganas de nada", "Apática"],
    [
      "Indiferente",
      "sentirte sin inspiración o aburrido",
      "Indiferente",
      "sentirte sin inspiración o aburrida",
    ],
  ]),
  ...defineQuadrant("LOW_PLEASANT", [
    [
      "Sereno",
      "tranquilo y pacífico; sin problemas",
      "Serena",
      "tranquila y pacífica; sin problemas",
    ],
    ["Pleno", "sentir que lo que vives ahora tiene sentido", "Plena"],
    [
      "Agradecido",
      "valorar algo bueno que tienes o has recibido",
      "Agradecida",
    ],
    ["En paz", "sin conflicto interno"],
    [
      "Satisfecho",
      "contento con lo que tienes o has hecho",
      "Satisfecha",
      "contenta con lo que tienes o has hecho",
    ],
    ["Querido", "sentir el cariño de otras personas", "Querida"],
    ["Seguro", "a salvo y protegido", "Segura", "a salvo y protegida"],
    ["Equilibrado", "estable y centrado", "Equilibrada", "estable y centrada"],
    [
      "Relajado",
      "sentirte relajado y despreocupado",
      "Relajada",
      "sentirte relajada y despreocupada",
    ],
    ["Tranquilo", "sin prisas ni preocupaciones", "Tranquila"],
    ["Comprendido", "sentir que otros entienden cómo estás", "Comprendida"],
    [
      "Conectado",
      "unido a otras personas o a lo que haces",
      "Conectada",
      "unida a otras personas o a lo que haces",
    ],
    ["Cómodo", "a gusto en el lugar o la situación", "Cómoda"],
    ["Reflexivo", "pensar con calma sobre las cosas", "Reflexiva"],
    ["Descansado", "con la energía recuperada tras descansar", "Descansada"],
    ["Apacible", "con una calma suave y estable"],
    [
      "Acompañado",
      "sentir que no estás solo",
      "Acompañada",
      "sentir que no estás sola",
    ],
    ["Compasivo", "sentir ternura y comprensión por alguien", "Compasiva"],
    ["A gusto", "bien con lo que está pasando"],
    ["Bien", "estar bien, sin más"],
  ]),
];

const TREE_ONLY_EMOTIONS: EmotionDefinition[] = [
  ...defineQuadrant("HIGH_UNPLEASANT", [
    ["Molesto", "incomodado por algo que te desagrada", "Molesta", "incomodada por algo que te desagrada"],
    ["Impotente", "sentir que no puedes hacer nada para cambiar lo que pasa"],
    ["Bloqueado", "atascado, sin saber cómo avanzar", "Bloqueada", "atascada, sin saber cómo avanzar"],
    ["Traicionado", "herido por alguien en quien confiabas", "Traicionada", "herida por alguien en quien confiabas"],
    ["Despreciado", "sentir que te tratan como si no valieras", "Despreciada"],
    ["Indignado", "enfadado ante algo que te parece injusto", "Indignada", "enfadada ante algo que te parece injusto"],
    ["Harto", "sin paciencia tras aguantar algo demasiado tiempo", "Harta"],
    ["Saturado", "sentir que no te cabe nada más", "Saturada"],
    ["Agobiado", "sentir que todo se te echa encima", "Agobiada"],
    ["Inseguro", "dudar de ti o de lo que puede pasar", "Insegura"],
    ["Insuficiente", "sentir que no estás a la altura"],
    ["Indeciso", "no saber qué elegir ni qué hacer", "Indecisa"],
    ["Presionado", "sentir que te exigen más de lo que puedes dar", "Presionada"],
    ["Intimidado", "cohibido ante alguien o algo que te impone", "Intimidada", "cohibida ante alguien o algo que te impone"],
    ["Cohibido", "frenado por miedo a lo que piensen los demás", "Cohibida", "frenada por miedo a lo que piensen los demás"],
    ["Alerta", "pendiente de cualquier posible amenaza"],
    ["Desconfiado", "sospechar de las intenciones de los demás", "Desconfiada"],
  ]),
  ...defineQuadrant("LOW_UNPLEASANT", [
    ["Abandonado", "sentir que te han dejado de lado quienes importan", "Abandonada"],
    ["Incomprendido", "sentir que nadie entiende cómo estás", "Incomprendida"],
    ["Herido", "dolido por algo que te han hecho o dicho", "Herida", "dolida por algo que te han hecho o dicho"],
    ["Rechazado", "sentir que no te quieren o no te aceptan", "Rechazada"],
    ["Arrepentido", "desear no haber hecho o dicho algo", "Arrepentida"],
    ["Frágil", "sentir que cualquier cosa puede romperte"],
    ["Indefenso", "sin recursos para protegerte", "Indefensa"],
  ]),
  ...defineQuadrant("HIGH_PLEASANT", [
    ["Capaz", "confiar en que puedes con lo que te propones"],
    ["Entretenido", "con la atención puesta en algo que disfrutas", "Entretenida"],
    ["Valiente", "afrontar algo a pesar del miedo"],
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

const KNOWN_EMOTIONS = [...EMOTIONS, ...TREE_ONLY_EMOTIONS];

export type EmotionGroupItem = {
  name: string;
  quadrant: MoodQuadrant;
};

export type EmotionGroup = {
  id: string;
  label: string;
  quadrant: MoodQuadrant;
  items: EmotionGroupItem[];
};

export const EMOTION_QUADRANT_GROUPS: EmotionGroup[] = MOOD_QUADRANTS.map((quadrant) => ({
  id: quadrant.id,
  label: `${quadrant.energy}
${quadrant.pleasantness}`,
  quadrant: quadrant.id,
  items: EMOTIONS.filter((emotion) => emotion.quadrant === quadrant.id).map((emotion) => ({
    name: emotion.name,
    quadrant: quadrant.id,
  })),
}));

const EMOTIONS_BY_NAME = new Map(
  KNOWN_EMOTIONS.map((emotion) => [emotion.name.toLowerCase(), emotion]),
);

const EMOTIONS_BY_CANONICAL_NAME = new Map(
  KNOWN_EMOTIONS.map((emotion) => [emotion.name, emotion]),
);

export function findEmotion(name: string) {
  return EMOTIONS_BY_NAME.get(name.toLowerCase());
}

export function getEmotionLabel(name: string, gender: GrammaticalGender) {
  if (gender !== "feminine") {
    return name;
  }

  return EMOTIONS_BY_CANONICAL_NAME.get(name)?.feminineName ?? name;
}

export function getEmotionDefinition(
  emotion: Pick<EmotionOption, "definition" | "feminineDefinition">,
  gender: GrammaticalGender,
) {
  return gender === "feminine" ? emotion.feminineDefinition : emotion.definition;
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
  color: string;
  ring: string;
  ghost: string;
  fade: string;
};

export const MOOD_STYLES: Record<MoodQuadrant, MoodStyles> = {
  HIGH_UNPLEASANT: {
    tones: { 1: "bg-mood-hu-1", 2: "bg-mood-hu-2", 3: "bg-mood-hu-3" },
    soft: "bg-mood-hu-soft",
    strong: "text-mood-hu-strong",
    color: "var(--mood-hu-2)",
    ring: "ring-mood-hu-strong",
    ghost: "bg-mood-hu-3/60",
    fade: "to-mood-hu-1/70",
  },
  HIGH_PLEASANT: {
    tones: { 1: "bg-mood-hp-1", 2: "bg-mood-hp-2", 3: "bg-mood-hp-3" },
    soft: "bg-mood-hp-soft",
    strong: "text-mood-hp-strong",
    color: "var(--mood-hp-2)",
    ring: "ring-mood-hp-strong",
    ghost: "bg-mood-hp-3/60",
    fade: "to-mood-hp-1/70",
  },
  LOW_UNPLEASANT: {
    tones: { 1: "bg-mood-lu-1", 2: "bg-mood-lu-2", 3: "bg-mood-lu-3" },
    soft: "bg-mood-lu-soft",
    strong: "text-mood-lu-strong",
    color: "var(--mood-lu-2)",
    ring: "ring-mood-lu-strong",
    ghost: "bg-mood-lu-3/60",
    fade: "to-mood-lu-1/70",
  },
  LOW_PLEASANT: {
    tones: { 1: "bg-mood-lp-1", 2: "bg-mood-lp-2", 3: "bg-mood-lp-3" },
    soft: "bg-mood-lp-soft",
    strong: "text-mood-lp-strong",
    color: "var(--mood-lp-2)",
    ring: "ring-mood-lp-strong",
    ghost: "bg-mood-lp-3/60",
    fade: "to-mood-lp-1/70",
  },
};

const NEUTRAL_MOOD_STYLES: MoodStyles = {
  tones: { 1: "bg-accent", 2: "bg-accent", 3: "bg-accent" },
  soft: "bg-secondary",
  strong: "text-primary",
  color: "var(--primary)",
  ring: "ring-primary",
  ghost: "bg-primary/30",
  fade: "to-accent",
};

export function getMoodStyles(quadrant: MoodQuadrant | null) {
  return quadrant ? MOOD_STYLES[quadrant] : NEUTRAL_MOOD_STYLES;
}
