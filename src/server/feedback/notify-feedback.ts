import type { FeedbackEase, FeedbackKind, FeedbackTrigger, UserRole } from "@/db/schema";
import { logger } from "@/lib/logger";

const KIND_LABEL: Record<FeedbackKind, string> = {
  idea: "Idea o sugerencia",
  bug: "Algo no funciona",
  other: "Otra cosa",
};

const EASE_LABEL: Record<FeedbackEase, string> = {
  easy: "Fácil",
  neutral: "Más o menos",
  hard: "Difícil",
};

export async function notifyFeedback(input: {
  role: UserRole;
  trigger: FeedbackTrigger;
  kind: FeedbackKind | null;
  ease: FeedbackEase | null;
  wantsCall: boolean;
}) {
  const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  const summary = [
    input.kind ? KIND_LABEL[input.kind] : null,
    input.ease ? `Facilidad: ${EASE_LABEL[input.ease]}` : null,
    input.wantsCall ? "Quiere una llamada" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `Nuevo feedback (${input.role}, ${input.trigger}): ${summary}`,
      }),
    });
  } catch (error) {
    logger.error("feedback.notify_failed", error);
  }
}
