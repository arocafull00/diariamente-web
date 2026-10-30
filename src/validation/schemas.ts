import { z } from "zod";

import { isPredefinedAvatarUrl } from "@/lib/avatars";
import { MAX_BODY_SENSATIONS } from "@/lib/body-sensations";

const clerkImageHost = "img.clerk.com";

function isAllowedAvatarUrl(url: string): boolean {
  if (isPredefinedAvatarUrl(url)) {
    return true;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === clerkImageHost;
  } catch {
    return false;
  }
}

const grammaticalGenderSchema = z.enum(["feminine", "masculine", "unspecified"], {
  error: "Elige cómo prefieres que te llame",
});

export const onboardingSchema = z.object({
  firstName: z.string().trim().min(1, "El nombre es obligatorio"),
  lastName: z.string().trim().min(1, "Los apellidos son obligatorios"),
  role: z.enum(["patient", "psychologist"]),
  grammaticalGender: grammaticalGenderSchema,
  avatarUrl: z
    .string()
    .trim()
    .nullable()
    .refine(
      (value) => value === null || isPredefinedAvatarUrl(value),
      "Avatar no válido",
    ),
});

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, "El nombre es obligatorio"),
  lastName: z.string().trim().min(1, "Los apellidos son obligatorios"),
  avatarUrl: z
    .string()
    .trim()
    .nullable()
    .refine(
      (value) => value === null || isAllowedAvatarUrl(value),
      "Avatar no válido",
    ),
});

export const updateGrammaticalGenderSchema = z.object({
  grammaticalGender: grammaticalGenderSchema,
});

export const recordEmotionSchema = z.object({
  emotion: z.string().trim().min(1),
  intensity: z.number().int().min(1).max(10),
});

const moodQuadrantSchema = z.enum([
  "HIGH_UNPLEASANT",
  "HIGH_PLEASANT",
  "LOW_UNPLEASANT",
  "LOW_PLEASANT",
]);

const contextTagsSchema = z
  .array(z.string().trim().min(1).max(40))
  .max(12);

const reflectionSchema = z.string().trim().max(5000);

export const bodySensationSchema = z.object({
  id: z.string().trim().min(1).max(64),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  side: z.enum(["front", "back"]),
  pleasantness: z.number().int().min(0).max(100),
  intensity: z.number().int().min(0).max(100),
  tags: contextTagsSchema,
});

const recordEmotionsSchema = z
  .array(recordEmotionSchema)
  .min(1, "Selecciona al menos una emoción");

const bodySensationsSchema = z
  .array(bodySensationSchema)
  .max(MAX_BODY_SENSATIONS)
  .refine(
    (sensations) =>
      new Set(sensations.map((sensation) => sensation.id)).size ===
      sensations.length,
    "Cada punto del cuerpo solo puede registrarse una vez",
  );

export const createRecordSchema = z.object({
  occurredAt: z.coerce.date(),
  quadrant: moodQuadrantSchema,
  emotions: recordEmotionsSchema,
  context: z.object({
    topics: contextTagsSchema,
    people: contextTagsSchema,
    places: contextTagsSchema,
  }),
  bodySensations: bodySensationsSchema,
  situation: reflectionSchema,
  thoughts: reflectionSchema,
  behaviours: reflectionSchema,
});

export const updateRecordSchema = z.object({
  quadrant: moodQuadrantSchema.nullable(),
  emotions: recordEmotionsSchema,
  bodySensations: bodySensationsSchema,
  situation: reflectionSchema,
  thoughts: reflectionSchema,
  behaviours: reflectionSchema,
});

export const reminderSchema = z.object({
  enabled: z.boolean(),
});

export const recordNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "La nota no puede estar vacía")
    .max(2000),
});

export const connectionConsentSchema = z.object({
  consent: z.literal(true, {
    error: "Debes dar tu consentimiento para conectar con tu profesional",
  }),
});

export const requiredScreenSchema = z.enum(["welcome", "terms"]);

const feedbackClientContextSchema = z.object({
  path: z.string().max(200),
  standalone: z.boolean(),
  userAgent: z.string().max(500),
});

export const feedbackFormSchema = z.object({
  kind: z.enum(["idea", "bug", "other"], { error: "Elige un tipo" }),
  message: z
    .string()
    .trim()
    .min(1, "Cuéntanos algo antes de enviar")
    .max(2000, "Máximo 2000 caracteres"),
  wantsCall: z.boolean(),
});

export const submitFeedbackSchema = feedbackFormSchema.extend({
  trigger: z.enum(["profile", "sidebar", "streak"]),
  clientContext: feedbackClientContextSchema,
});

export const feedbackEaseSchema = z.object({
  ease: z.enum(["easy", "neutral", "hard"]),
  clientContext: feedbackClientContextSchema,
});
