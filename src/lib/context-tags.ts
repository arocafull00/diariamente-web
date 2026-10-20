import type { RecordContext } from "@/db/schema";

export type ContextGroup = keyof RecordContext;

export const CONTEXT_GROUPS: {
  id: ContextGroup;
  label: string;
  options: string[];
}[] = [
  {
    id: "topics",
    label: "Qué hacías",
    options: [
      "Trabajando",
      "Estudiando",
      "Comiendo",
      "Conduciendo",
      "Haciendo ejercicio",
      "Descansando",
      "En redes sociales",
      "Pasando el rato",
      "Pasatiempos",
    ],
  },
  {
    id: "people",
    label: "Con quién estabas",
    options: [
      "Solo",
      "Pareja",
      "Familia",
      "Amigos",
      "Compañeros de trabajo",
      "Desconocidos",
      "Mascotas",
    ],
  },
  {
    id: "places",
    label: "Dónde estabas",
    options: [
      "Casa",
      "Trabajo",
      "Centro de estudios",
      "De camino",
      "Afuera",
      "Transporte público",
    ],
  },
];

export const EMPTY_RECORD_CONTEXT: RecordContext = {
  topics: [],
  people: [],
  places: [],
};

export function getContextTags(context: RecordContext) {
  return [...context.topics, ...context.people, ...context.places];
}
