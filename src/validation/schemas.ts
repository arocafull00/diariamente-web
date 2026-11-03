import { z } from "zod";

import { isPredefinedAvatarUrl } from "@/lib/avatars";
import { MAX_BODY_SENSATIONS } from "@/lib/body-sensations";
import {
  ACQUISITION_SOURCES,
  CASELOADS,
  ONBOARDING_GOALS,
  PATIENT_GOALS,
  PSYCHOLOGIST_GOALS,
  RECORDS_EXPERIENCES,
  THERAPY_STATUSES,
} from "@/lib/onboarding-answers";

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
  firstName: z.string().trim().min(1, "Dinos tu nombre").max(80, "Ese nombre es muy largo"),
  lastName: z
    .string()
    .trim()
    .min(1, "Dinos tus apellidos")
    .max(120, "Esos apellidos son muy largos"),
  role: z.enum(["patient", "psychologist", "clinic"], {
    error: "Elige un tipo de cuenta",
  }),
  clinicName: z.string().trim().max(120, "Ese nombre es muy largo"),
  grammaticalGender: grammaticalGenderSchema,
  avatarUrl: z
    .string()
    .trim()
    .nullable()
    .refine(
      (value) => value === null || isPredefinedAvatarUrl(value),
      "Elige otro avatar",
    ),
  acquisitionSource: z.enum(ACQUISITION_SOURCES, {
    error: "Cuéntanos cómo nos has conocido",
  }),
  goal: z.enum(ONBOARDING_GOALS).nullable(),
  therapyStatus: z.enum(THERAPY_STATUSES).nullable(),
  recordsExperience: z.enum(RECORDS_EXPERIENCES).nullable(),
  caseload: z.enum(CASELOADS).nullable(),
  legalAccepted: z.boolean(),
}).superRefine((value, ctx) => {
  if (value.role === "clinic" && !value.clinicName) {
    ctx.addIssue({
      code: "custom",
      path: ["clinicName"],
      message: "¿Cómo se llama tu clínica?",
    });
  }

  if (
    value.role === "patient" &&
    !(PATIENT_GOALS as readonly (string | null)[]).includes(value.goal)
  ) {
    ctx.addIssue({ code: "custom", path: ["goal"], message: "Elige qué te trae por aquí" });
  }

  if (
    value.role === "psychologist" &&
    !(PSYCHOLOGIST_GOALS as readonly (string | null)[]).includes(value.goal)
  ) {
    ctx.addIssue({ code: "custom", path: ["goal"], message: "Elige qué te gustaría conseguir" });
  }

  if (value.role === "patient" && (!value.therapyStatus || !value.recordsExperience)) {
    ctx.addIssue({
      code: "custom",
      path: [value.therapyStatus ? "recordsExperience" : "therapyStatus"],
      message: "Te falta alguna pregunta por responder",
    });
  }

  if (value.role === "psychologist" && !value.caseload) {
    ctx.addIssue({
      code: "custom",
      path: ["caseload"],
      message: "Cuéntanos cuántos pacientes acompañas",
    });
  }
});

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, "Dinos tu nombre"),
  lastName: z.string().trim().min(1, "Dinos tus apellidos"),
  avatarUrl: z
    .string()
    .trim()
    .nullable()
    .refine(
      (value) => value === null || isAllowedAvatarUrl(value),
      "Elige otro avatar",
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
  .min(1, "Elige al menos una emoción");

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

const pushServiceHosts = [
  "fcm.googleapis.com",
  "updates.push.services.mozilla.com",
  "push.apple.com",
  "notify.windows.com",
];

function isPushServiceUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    return (
      protocol === "https:" &&
      pushServiceHosts.some(
        (host) => hostname === host || hostname.endsWith(`.${host}`),
      )
    );
  } catch {
    return false;
  }
}

const pushKeySchema = z
  .string()
  .max(200)
  .regex(/^[A-Za-z0-9_-]+=*$/);

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().max(1000).refine(isPushServiceUrl),
  keys: z.object({
    p256dh: pushKeySchema,
    auth: pushKeySchema,
  }),
});

export const recordNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Escribe algo en la nota")
    .max(2000),
});

export const connectionConsentSchema = z.object({
  consent: z.literal(true, {
    error: "Debes dar tu consentimiento para conectar con tu profesional",
  }),
});

export const clinicJoinConsentSchema = z.object({
  consent: z.literal(true, {
    error: "Debes dar tu consentimiento para unirte a la clínica",
  }),
});

export const clinicPsychologistIdSchema = z.string().trim().min(1);

export const requiredScreenSchema = z.enum(["welcome", "terms"]);

export const emailPasswordSchema = z.object({
  email: z.string().trim().pipe(z.email("Ese correo no parece válido. ¿Lo revisas?")),
  password: z
    .string()
    .min(8, "Tu contraseña necesita al menos 8 caracteres")
    .max(72, "Esa contraseña es demasiado larga"),
});

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Introduce el código de 6 dígitos"),
});

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

export const adminBillingIdsSchema = z
  .array(z.string().trim().min(1).max(64))
  .min(1)
  .max(50);

export const adminBillingUpdateSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("lifetime"), enabled: z.boolean() }),
  z.object({
    action: z.literal("clinic-price"),
    monthlyPriceCents: z.number().int().min(100).max(10_000_000),
  }),
]);

export const referralCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{8}$/, "El código tiene 8 letras y números");
