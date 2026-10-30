import { differenceInDays } from "date-fns";

import type { EmotionIntensity, MoodQuadrant } from "@/db/schema";

export const FEEDBACK_PROMPT_MIN_STREAK = 2;
export const FEEDBACK_PROMPT_COOLDOWN_DAYS = 30;

const UNPLEASANT_QUADRANTS: MoodQuadrant[] = ["HIGH_UNPLEASANT", "LOW_UNPLEASANT"];

export function shouldShowFeedbackPrompt(input: {
  streak: number;
  promptedAt: Date | null;
  latestQuadrant: MoodQuadrant | null;
  latestIntensity: EmotionIntensity | null;
  now: Date;
}) {
  if (input.streak < FEEDBACK_PROMPT_MIN_STREAK) {
    return false;
  }

  if (
    input.promptedAt &&
    differenceInDays(input.now, input.promptedAt) < FEEDBACK_PROMPT_COOLDOWN_DAYS
  ) {
    return false;
  }

  const intenseUnpleasant =
    input.latestIntensity === "HIGH" &&
    input.latestQuadrant !== null &&
    UNPLEASANT_QUADRANTS.includes(input.latestQuadrant);

  return !intenseUnpleasant;
}

export function getFeedbackClientContext() {
  return {
    path: window.location.pathname,
    standalone: window.matchMedia("(display-mode: standalone)").matches,
    userAgent: navigator.userAgent.slice(0, 500),
  };
}
