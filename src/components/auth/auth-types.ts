import { z } from "zod";

import {
  emailPasswordSchema,
  verificationCodeSchema,
} from "@/validation/schemas";

export type EmailPasswordValues = z.infer<typeof emailPasswordSchema>;

export type VerificationCodeValues = z.infer<typeof verificationCodeSchema>;

export type EmailAuthStep = "credentials" | "code";
