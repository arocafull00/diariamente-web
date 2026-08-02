import { z } from "zod";

import { onboardingSchema } from "@/validation/schemas";

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export type OnboardingStep = 0 | 1 | 2;
