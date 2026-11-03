import { differenceInDays } from "date-fns";

import type { EmotionIntensity, MoodQuadrant } from "@/db/schema";

export const FEEDBACK_PROMPT_MIN_STREAK = 2;
export const FEEDBACK_PROMPT_COOLDOWN_DAYS = 30;
export const REVIEW_PROMPT_MIN_STREAK = 3;

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

  return !isIntenseUnpleasant(input.latestQuadrant, input.latestIntensity);
}

export function shouldShowReviewPrompt(input: {
  streak: number;
  latestQuadrant: MoodQuadrant | null;
  latestIntensity: EmotionIntensity | null;
}) {
  if (input.streak < REVIEW_PROMPT_MIN_STREAK) {
    return false;
  }

  return !isIntenseUnpleasant(input.latestQuadrant, input.latestIntensity);
}

function isIntenseUnpleasant(
  quadrant: MoodQuadrant | null,
  intensity: EmotionIntensity | null,
) {
  return (
    intensity === "HIGH" &&
    quadrant !== null &&
    UNPLEASANT_QUADRANTS.includes(quadrant)
  );
}

export function getFeedbackClientContext() {
  return {
    path: window.location.pathname,
    standalone: window.matchMedia("(display-mode: standalone)").matches,
    userAgent: navigator.userAgent.slice(0, 500),
  };
}
