import { z } from "zod";

export const onboardingSchema = z.object({
  firstName: z.string().trim().min(1, "El nombre es obligatorio"),
  lastName: z.string().trim().min(1, "Los apellidos son obligatorios"),
  role: z.enum(["patient", "psychologist"]),
});

export const recordEmotionSchema = z.object({
  emotion: z.string().trim().min(1),
  intensity: z.number().int().min(1).max(10),
});

export const createRecordSchema = z.object({
  occurredAt: z.coerce.date(),
  situation: z.string().trim().min(1, "La situación es obligatoria"),
  thoughts: z.string().trim().min(1, "Los pensamientos son obligatorios"),
  behaviours: z.string().trim().min(1, "Las conductas son obligatorias"),
  emotions: z
    .array(recordEmotionSchema)
    .min(1, "Selecciona al menos una emoción"),
});

export const updateRecordSchema = z.object({
  situation: z.string().trim().min(1),
  thoughts: z.string().trim().min(1),
  behaviours: z.string().trim().min(1),
});

export const customEmotionSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(50),
});

export const redeemInvitationSchema = z.object({
  code: z.string().trim().min(1, "Introduce un código"),
});

export const reminderSchema = z.object({
  enabled: z.boolean(),
  frequency: z.enum(["daily", "weekly"]),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  days: z.array(z.string()),
});
