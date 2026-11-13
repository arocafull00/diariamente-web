import { z } from "zod";

export const SIGNUP_ACQUISITION_COOKIE = "diariamente-signup-origin";
export const SIGNUP_ACQUISITION_WINDOW = 24 * 60 * 60 * 1000;
export const signupChannelSchema = z.enum(["linkedin", "instagram", "facebook", "web"]);
export const signupPlatformSchema = z.enum(["web", "android"]);
export const signupLandingSchema = z.enum(["info.diariamente.es", "clinicas.diariamente.es", "pacientes.diariamente.es"]);
export const signupOriginSchema = z.object({
  channel: signupChannelSchema,
  landingHost: signupLandingSchema.nullable(),
  capturedAt: z.number().int().positive(),
});

export function signupChannel(source: string) {
  const value = source.toLowerCase().replace(/^www\./, "");
  if (["linkedin", "li", "lnkd.in"].includes(value) || /(^|\.)linkedin\.com$/.test(value)) return "linkedin";
  if (["instagram", "ig", "insta"].includes(value) || /(^|\.)instagram\.com$/.test(value)) return "instagram";
  if (["facebook", "fb", "fb.com", "fb.me"].includes(value) || /(^|\.)facebook\.com$/.test(value)) return "facebook";
  return "web";
}

export function readSignupOrigin(value: string | undefined) {
  if (!value) return null;
  try {
    const result = signupOriginSchema.safeParse(JSON.parse(value));
    if (!result.success || result.data.capturedAt > Date.now() || Date.now() - result.data.capturedAt > SIGNUP_ACQUISITION_WINDOW) return null;
    return result.data;
  } catch {
    return null;
  }
}
