import { z } from "zod";

import { isPredefinedAvatarUrl } from "@/lib/avatars";
import { BODY_REGION_IDS } from "@/lib/body-sensations";

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

export const onboardingSchema = z.object({
  firstName: z.string().trim().min(1, "El nombre es obligatorio"),
  lastName: z.string().trim().min(1, "Los apellidos son obligatorios"),
  role: z.enum(["patient", "psychologist"]),
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
  region: z.enum(BODY_REGION_IDS),
  pleasantness: z.number().int().min(0).max(100),
  intensity: z.number().int().min(0).max(100),
  tags: contextTagsSchema,
});

export const bodyFigureSchema = z.object({
  figure: z.enum(["masculine", "feminine"]),
});

export const createRecordSchema = z.object({
  occurredAt: z.coerce.date(),
  quadrant: moodQuadrantSchema,
  emotions: z
    .array(recordEmotionSchema)
    .min(1, "Selecciona al menos una emoción"),
  context: z.object({
    topics: contextTagsSchema,
    people: contextTagsSchema,
    places: contextTagsSchema,
  }),
  bodySensations: z
    .array(bodySensationSchema)
    .max(BODY_REGION_IDS.length)
    .refine(
      (sensations) =>
        new Set(sensations.map((sensation) => sensation.region)).size ===
        sensations.length,
      "Cada zona del cuerpo solo puede registrarse una vez",
    ),
  situation: reflectionSchema,
  thoughts: reflectionSchema,
  behaviours: reflectionSchema,
});

export const updateRecordSchema = z.object({
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
