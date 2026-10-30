"use client";

import { MessageCircleHeart, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  FEEDBACK_COPY,
  FEEDBACK_EASE_OPTIONS,
} from "@/components/feedback/feedback-content";
import { FeedbackSheet } from "@/components/feedback/feedback-sheet";
import { Button } from "@/components/ui/button";
import type { FeedbackEase } from "@/db/schema";
import { getFeedbackClientContext } from "@/lib/feedback";
import {
  dismissFeedbackPrompt,
  submitFeedbackEase,
} from "@/server/actions/feedback";

type PromptStep = "question" | "answered" | "hidden";

export function FeedbackPromptCard() {
  const [step, setStep] = useState<PromptStep>("question");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleEase(ease: FeedbackEase) {
    startTransition(async () => {
      const result = await submitFeedbackEase({
        ease,
        clientContext: getFeedbackClientContext(),
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setStep("answered");
    });
  }

  function handleDismiss() {
    setStep("hidden");
    void dismissFeedbackPrompt();
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);

    if (!open) {
      setStep("hidden");
    }
  }

  if (step === "hidden") {
    return null;
  }

  return (
    <section className="relative space-y-4 rounded-[2rem] bg-mood-hp-soft/60 p-5 ring-1 ring-border/50">
      {step === "question" ? (
        <button
          type="button"
          aria-label="Ahora no"
          disabled={pending}
          onClick={handleDismiss}
          className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
      <div className="flex items-start gap-3 pr-8">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-card text-mood-hp-strong">
          <MessageCircleHeart className="size-5" aria-hidden="true" />
        </span>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold tracking-wide text-mood-hp-strong uppercase">
            {FEEDBACK_COPY.promptTitle}
          </p>
          <p className="font-semibold text-balance">
            {step === "question"
              ? FEEDBACK_COPY.promptQuestion
              : FEEDBACK_COPY.promptThanks}
          </p>
        </div>
      </div>
      {step === "question" ? (
        <div className="flex flex-wrap gap-2">
          {FEEDBACK_EASE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              className="rounded-full bg-card"
              disabled={pending}
              onClick={() => handleEase(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button className="rounded-full" onClick={() => setSheetOpen(true)}>
            {FEEDBACK_COPY.promptMore}
          </Button>
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => setStep("hidden")}
          >
            Cerrar
          </Button>
        </div>
      )}
      <FeedbackSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        role="patient"
        trigger="streak"
      />
    </section>
  );
}
