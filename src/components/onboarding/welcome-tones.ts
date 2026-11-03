import type { WelcomeTone } from "@/components/onboarding/welcome-content";

export const WELCOME_TONE_CLASSES: Record<
  WelcomeTone,
  { selected: string; check: string; chip: string; soft: string }
> = {
  hp: {
    selected: "border-mood-hp-3 bg-mood-hp-soft",
    check: "border-mood-hp-3 bg-mood-hp-3 text-mood-foreground",
    chip: "bg-mood-hp-soft text-mood-hp-strong",
    soft: "bg-mood-hp-soft",
  },
  lu: {
    selected: "border-mood-lu-3 bg-mood-lu-soft",
    check: "border-mood-lu-3 bg-mood-lu-3 text-mood-foreground",
    chip: "bg-mood-lu-soft text-mood-lu-strong",
    soft: "bg-mood-lu-soft",
  },
  hu: {
    selected: "border-mood-hu-3 bg-mood-hu-soft",
    check: "border-mood-hu-3 bg-mood-hu-3 text-mood-foreground",
    chip: "bg-mood-hu-soft text-mood-hu-strong",
    soft: "bg-mood-hu-soft",
  },
  lp: {
    selected: "border-mood-lp-3 bg-mood-lp-soft",
    check: "border-mood-lp-3 bg-mood-lp-3 text-mood-foreground",
    chip: "bg-mood-lp-soft text-mood-lp-strong",
    soft: "bg-mood-lp-soft",
  },
};
