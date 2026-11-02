import type { WelcomeTone } from "@/components/onboarding/welcome-content";

export const WELCOME_TONE_CLASSES: Record<
  WelcomeTone,
  { selected: string; check: string }
> = {
  hp: {
    selected: "border-mood-hp-3 bg-mood-hp-soft",
    check: "border-mood-hp-3 bg-mood-hp-3 text-mood-foreground",
  },
  lu: {
    selected: "border-mood-lu-3 bg-mood-lu-soft",
    check: "border-mood-lu-3 bg-mood-lu-3 text-mood-foreground",
  },
  hu: {
    selected: "border-mood-hu-3 bg-mood-hu-soft",
    check: "border-mood-hu-3 bg-mood-hu-3 text-mood-foreground",
  },
  lp: {
    selected: "border-mood-lp-3 bg-mood-lp-soft",
    check: "border-mood-lp-3 bg-mood-lp-3 text-mood-foreground",
  },
};
