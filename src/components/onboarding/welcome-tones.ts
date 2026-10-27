import type { WelcomeTone } from "@/components/onboarding/welcome-content";

export const WELCOME_TONE_CLASSES: Record<
  WelcomeTone,
  { selected: string }
> = {
  hp: {
    selected: "border-mood-hp-3 bg-mood-hp-soft",
  },
  lu: {
    selected: "border-mood-lu-3 bg-mood-lu-soft",
  },
  hu: {
    selected: "border-mood-hu-3 bg-mood-hu-soft",
  },
  lp: {
    selected: "border-mood-lp-3 bg-mood-lp-soft",
  },
};
