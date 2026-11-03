"use client";

import { Star } from "lucide-react";

import { PLAY_REVIEW_COPY } from "@/components/feedback/feedback-content";
import { usePlayReviewPrompt } from "@/components/feedback/use-play-review-prompt";
import { Button } from "@/components/ui/button";

export function PlayReviewCard() {
  const { visible, rate, dismiss } = usePlayReviewPrompt();

  if (!visible) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-[2rem] bg-mood-hp-soft/60 p-5 ring-1 ring-border/50">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-card text-mood-hp-strong">
          <Star className="size-5 fill-current" aria-hidden="true" />
        </span>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold tracking-wide text-mood-hp-strong uppercase">
            {PLAY_REVIEW_COPY.eyebrow}
          </p>
          <p className="font-semibold text-balance">{PLAY_REVIEW_COPY.title}</p>
          <p className="text-sm text-muted-foreground">
            {PLAY_REVIEW_COPY.description}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button className="rounded-full" onClick={rate}>
          <Star data-icon="inline-start" aria-hidden="true" />
          {PLAY_REVIEW_COPY.rate}
        </Button>
        <Button variant="ghost" className="rounded-full" onClick={dismiss}>
          {PLAY_REVIEW_COPY.dismiss}
        </Button>
      </div>
    </section>
  );
}
